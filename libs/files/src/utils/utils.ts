export const keysToLowerCase = (object: Object[]):any => {
    return object.map((o => {return Object.keys(o).reduce((accumulator, key) => {
        accumulator[key.toLowerCase()] = o[key];
        return accumulator;
      }, {})}))
}