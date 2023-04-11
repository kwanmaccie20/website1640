import dayjs, { extend, duration as _duration } from "dayjs";
import duration from "dayjs/plugin/duration";
extend(duration);

export function getTimeElapsed(createdDate) {
  const now = dayjs();
  const duration = _duration(now.diff(createdDate));

  if (duration.asMinutes() < 60) {
    if (Math.floor(duration.asMinutes()) < 1) return "a few seconds ago";
    return `${Math.floor(duration.asMinutes())} minute${
      Math.floor(duration.asMinutes()) === 1 ? "" : "s"
    } ago`;
  } else if (duration.asHours() < 24) {
    return `${Math.floor(duration.asHours())} hour${
      Math.floor(duration.asHours()) === 1 ? "" : "s"
    } ago`;
  } else if (duration.asDays() < 7) {
    return `${Math.floor(duration.asDays())} day${
      Math.floor(duration.asDays()) === 1 ? "" : "s"
    } ago`;
  } else {
    return dayjs(createdDate).format("MMM DD, YYYY");
  }
}
