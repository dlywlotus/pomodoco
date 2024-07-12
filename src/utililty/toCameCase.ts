const toCamelCase = (string: any) => {
  const words = string.split(" ");
  const camelCased: "pomodoro" | "shortBreak" | "longBreak" = words
    .map((word: any, i: number) => {
      return i > 0
        ? word[0].toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase();
    })
    .join("");

  return camelCased;
};

export default toCamelCase;
