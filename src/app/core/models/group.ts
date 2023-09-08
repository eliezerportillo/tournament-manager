export interface Group<T> {
  key: string;
  values: T[];
}

export class Grouper {
  static groupBy<T, K extends keyof T>(dataArray: T[], groupBy: K, sortBy?: (a: T, b: T) => number): Group<T>[] {
    const grouped = dataArray.reduce((groupedData: { [key: string]: T[] }, data: T) => {
      const groupKey: string = <string>data[groupBy];
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = [];
      }
      groupedData[groupKey].push(data);
      return groupedData;
    }, {});

    // const sortBy = (a: T, b: T): number => a.dateTime.getTime() - b.dateTime.getTime();
    return Object.entries(grouped).map(([key, value]) =>
    (
      { key, values: sortBy ? value.sort(sortBy) : value }
    )
    );
  }
}