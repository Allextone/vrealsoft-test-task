export const normalizeData = (data: any, isSnakeToCamel = true) => {
  if (data === null || data === undefined) {
    return null;
  }

  const isDataArray: boolean = Array.isArray(data);
  if (!isDataArray) {
    data = [data];
  }

  const result = [];
  for (const element of data) {
    const keys: string[] = Object.keys(element);
    const values: any[] = Object.values(element);

    let indexOfValue = 0;
    for (let element of values) {
      if (element === null || element === undefined) {
        indexOfValue++;
        continue;
      }

      if (typeof element === 'object') {
        const isValidType = !new Date(element).getTime();
        if (!isValidType) {
          indexOfValue++;
          continue;
        }

        const keysValue: string[] = Object.keys(element);
        const valuesValue: string[] = Object.values(element);

        const editedValueNameKeys: string[] = [];
        for (const keyValueItem of keysValue) {
          let editedValueNameKey: string;
          if (isSnakeToCamel) {
            editedValueNameKey = snakeToCamel(keyValueItem);
          } else {
            editedValueNameKey = camelToSnake(keyValueItem);
          }
          editedValueNameKeys.push(editedValueNameKey);
        }

        let cnt = 0;
        const valueKaysEntries = [];
        for (let item; item !== null; cnt++) {
          if (
            editedValueNameKeys[cnt] === null ||
            editedValueNameKeys[cnt] === undefined
          ) {
            item = null;
            continue;
          }
          valueKaysEntries.push([editedValueNameKeys[cnt], valuesValue[cnt]]);
        }
        element = Object.fromEntries(valueKaysEntries);
        values[indexOfValue] = element;
      }
      indexOfValue++;
    }

    const editedNameKeys: string[] = [];
    for (const keyItem of keys) {
      let editedName: string;
      if (isSnakeToCamel) {
        editedName = snakeToCamel(keyItem);
      } else {
        editedName = camelToSnake(keyItem);
      }

      editedNameKeys.push(editedName);
    }

    let cnt = 0;
    const entries = [];
    for (let item; item !== null; cnt++) {
      if (editedNameKeys[cnt] === null || editedNameKeys[cnt] === undefined) {
        item = null;
        continue;
      }
      entries.push([editedNameKeys[cnt], values[cnt]]);
    }

    result.push(Object.fromEntries(entries));
  }

  if (isDataArray) {
    return result;
  } else {
    return result[0];
  }
};

const snakeToCamel = (str: string): string =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group: string) =>
      group.toUpperCase().replace('-', '').replace('_', ''),
    );

const camelToSnake = (str: string): string =>
  str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

export const getLastYearDate = (): string => {
  const date = new Date();
  return new Date(date.setDate(date.getDate() - 365)).toISOString();
};
