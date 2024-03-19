import Water from "../models/WaterNote.js";
import User from "../models/User.js";
import formatDate from "../helpers/formatDate.js";
import HttpError from "../helpers/HttpError.js";

export async function addWaterService(body) {
  const { date } = body;
  const currentDate = formatDateForEndpoins(date);

  const newWaterNote = await Water.create({ ...body, date: currentDate });
  return newWaterNote;
}

export async function updateWaterService(id, owner, body) {
  const { date } = body;
  const currentDate = formatDateForEndpoins(date);

  const updatedNote = await Water.findOneAndUpdate(
    { _id: id, owner },
    { ...body, date: currentDate },
    {
      new: true,
    }
  );
  return updatedNote;
}

export async function deleteWaterService(id, owner) {
  const delatedWater = await Water.findOneAndDelete({ _id: id, owner });
  return delatedWater;
}

export async function getWaterConsumptionDaySummary(owner, date) {
  const user = await User.findById(owner);
  if (!user) throw HttpError(404, "User not found");
  const dailyNormAmount = user.dailyNorma;

  let waterConsumptionArray = await Water.aggregate([
    {
      $match: {
        $and: [
          { owner: owner },
          {
            date: {
              $gte: new Date(date),
              $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: null,
        waterVolumeSum: { $sum: "$waterAmount" },
        waterVolumes: { $push: "$$ROOT" },
      },
    },
    {
      $addFields: {
        waterVolumePercentage: {
          $round: {
            $multiply: [
              { $divide: ["$waterVolumeSum", dailyNormAmount * 1000] },
              100,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  if (waterConsumptionArray.length === 0) {
    waterConsumptionArray = [
      {
        waterVolumeSum: 0,
        waterVolumes: [],
        waterVolumePercentage: 0,
      },
    ];
  }

  console.log(waterConsumptionArray);

  return waterConsumptionArray;
}

export async function getWaterConsumptionMonthSummary(owner, year, month) {
  const user = await User.findById(owner);
  if (!user) throw HttpError(404, "User not found");

  const dailyNormAmount = user.dailyNorma;
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const waterConsumptionArray = await WaterNote.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        waterVolumeSum: { $sum: "$waterAmount" },
        waterVolumes: { $push: "$$ROOT" },
      },
    },
    {
      $match: {
        owner: owner,
        date: { $gte: firstDayOfMonth, $lt: lastDayOfMonth },
      },
    },
    {
      $addFields: {
        waterVolumePercentage: {
          $round: {
            $multiply: [
              { $divide: ["$waterVolumeSum", dailyNormAmount * 1000] },
              100,
            ],
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        waterVolumeSum: 1,
        waterVolumePercentage: 1,
        waterVolumes: 1,
      },
    },
  ]);

  const waterObjectresult = waterConsumptionArray.reduce((acc, item) => {
    const portions = item.waterVolumes.length;
    acc[item.date] = {
      date: formatDate(item.date),
      portions: portions,
      waterVolumePercentage: item.waterVolumePercentage,
      dailyNorma: dailyNormAmount,
    };
    return acc;
  }, {});

  return waterObjectresult;
}
