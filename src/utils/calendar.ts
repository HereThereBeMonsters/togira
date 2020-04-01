import { DateTime } from 'luxon';

export default {
  today (): [Date, Date] {
    const now = DateTime.local();
    return [
      now.startOf('day').toJSDate(),
      now.endOf('day').toJSDate()
    ];
  },

  yesterday (): [Date, Date] {
    const yesterday = DateTime.local().minus({ day: 1 });
    return [
      yesterday.startOf('day').toJSDate(),
      yesterday.endOf('day').toJSDate()
    ];
  },

  thisWeek (): [Date, Date] {
    const now = DateTime.local();
    return [
      now.startOf('week').toJSDate(),
      now.endOf('week').toJSDate()
    ];
  },

  lastWeek (): [Date, Date] {
    const aWeekAgo = DateTime.local().minus({ week: 1 });
    return [
      aWeekAgo.startOf('week').toJSDate(),
      aWeekAgo.endOf('week').toJSDate()
    ];
  },

  thisMonth (): [Date, Date] {
    const now = DateTime.local();
    return [
      now.startOf('month').toJSDate(),
      now.endOf('month').toJSDate()
    ];
  },

  lastMonth (): [Date, Date] {
    const aMonthAgo = DateTime.local().minus({ month: 1 });
    return [
      aMonthAgo.startOf('month').toJSDate(),
      aMonthAgo.endOf('month').toJSDate()
    ];
  },

  last7Days (): [Date, Date] {
    return this.lastDays(7);
  },

  last30Days (): [Date, Date] {
    return this.lastDays(30);
  },

  last90Days (): [Date, Date] {
    return this.lastDays(90);
  },

  lastDays (days: number): [Date, Date] {
    const now = DateTime.local();
    return [
      now.minus({ days }).startOf('day').toJSDate(),
      now.endOf('day').toJSDate()
    ];
  }
};
