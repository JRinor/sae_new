import { isSameDay, isSameWeek, isValidDeliveryDate, getNextValidDate } from '@/app/utils/dateUtils';

describe('dateUtils', () => {
  describe('isSameDay', () => {
    test('should return true for same day', () => {
      const date1 = new Date('2024-03-20');
      const date2 = new Date('2024-03-20');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    test('should return false for different days', () => {
      const date1 = new Date('2024-03-20');
      const date2 = new Date('2024-03-21');
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('isSameWeek', () => {
    test('should return true for dates in same week', () => {
      const date1 = new Date('2024-03-20');
      const date2 = new Date('2024-03-21');
      expect(isSameWeek(date1, date2)).toBe(true);
    });

    test('should return false for dates in different weeks', () => {
      const date1 = new Date('2024-03-20');
      const date2 = new Date('2024-03-28');
      expect(isSameWeek(date1, date2)).toBe(false);
    });
  });

  describe('isValidDeliveryDate', () => {
    const holidays = [new Date('2024-12-25')];
    const openWeeks = [new Date('2024-03-18')];

    test('should return true for valid delivery date', () => {
      const date = new Date('2024-03-20');
      expect(isValidDeliveryDate(date, holidays, openWeeks)).toBe(true);
    });

    test('should return false for holiday', () => {
      const date = new Date('2024-12-25');
      expect(isValidDeliveryDate(date, holidays, openWeeks)).toBe(false);
    });

    test('should return false for closed week', () => {
      const date = new Date('2024-04-01');
      expect(isValidDeliveryDate(date, holidays, openWeeks)).toBe(false);
    });
  });

  describe('getNextValidDate', () => {
    const holidays = [new Date('2024-03-21')];
    const openWeeks = [new Date('2024-03-18'), new Date('2024-03-25')];

    test('should return next valid date', () => {
      const date = new Date('2024-03-20');
      const nextDate = getNextValidDate(date, holidays, openWeeks);
      expect(nextDate.getDate()).toBe(22);
    });

    test('should skip holidays', () => {
      const date = new Date('2024-03-20');
      const nextDate = getNextValidDate(date, holidays, openWeeks);
      expect(isSameDay(nextDate, new Date('2024-03-21'))).toBe(false);
    });
  });
});

describe('DateUtils', () => {
  test('placeholder test', () => {
    expect(true).toBe(true);
  });
});
