export class DateUtil {
    static isAfter(date1: Date, date2: Date): boolean {
        return date1.getTime() > date2.getTime()
    }

    static addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
}