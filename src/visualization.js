import chalk from "chalk";
import { format, differenceInDays } from "date-fns";

export default function generateActivityVisualization(
  commitDates,
  startDate,
  endDate
) {
  const days = differenceInDays(endDate, startDate) + 1;
  const weeks = Math.ceil(days / 7);

  // Create a map of date to commit count
  const commitCountMap = commitDates.reduce((map, date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    map[dateStr] = (map[dateStr] || 0) + 1;
    return map;
  }, {});

  // Generate the grid
  let grid = "";
  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + week * 7 + day);
      if (currentDate > endDate) break;

      const dateStr = format(currentDate, "yyyy-MM-dd");
      const count = commitCountMap[dateStr] || 0;

      let color;
      if (count === 0) color = chalk.gray;
      else if (count <= 2) color = chalk.green;
      else if (count <= 4) color = chalk.greenBright;
      else if (count <= 6) color = chalk.yellow;
      else color = chalk.red;

      grid += color("█ ");
    }
    grid += "\n";
  }

  // Add legend
  const legend = `
${chalk.gray("█")} No commits   ${chalk.green(
    "█"
  )} 1-2 commits   ${chalk.greenBright("█")} 3-4 commits   ${chalk.yellow(
    "█"
  )} 5-6 commits   ${chalk.red("█")} 7+ commits
`;

  return grid + legend;
}
