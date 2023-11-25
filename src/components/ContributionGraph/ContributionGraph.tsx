// ContributionGraph.tsx

import React, { useEffect, useState } from "react";
import "./ContributionGraph.css";

interface ContributionsData {
  [date: string]: number;
}

const ContributionGraph: React.FC = () => {
  const [contributionsData, setContributionsData] = useState<ContributionsData>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dpg.gg/test/calendar.json");
        const data: ContributionsData = await response.json();
        setContributionsData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderContributions = () => {
    const currentDate = new Date();
    const today = currentDate.toISOString().split("T")[0];

    const weeks = 51;
    const daysPerWeek = 7;
    const totalDays = weeks * daysPerWeek;

    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - totalDays);

    const grid = [];

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const dateKey = currentDate.toISOString().split("T")[0];
      const contributionCount = contributionsData[dateKey] || 0;

      const dayOfWeek = currentDate.toLocaleString("default", {
        weekday: "long",
      });
      const monthAndDate = currentDate.toLocaleString("default", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      let cellClass = "contribution-cell";

      if (dateKey === today) {
        cellClass += " today";
      }

      if (contributionCount === 0) {
        cellClass += " no-contributions";
      } else if (contributionCount <= 9) {
        cellClass += " low-contributions";
      } else if (contributionCount <= 19) {
        cellClass += " medium-contributions";
      } else if (contributionCount <= 29) {
        cellClass += " high-contributions";
      } else {
        cellClass += " very-high-contributions";
      }

      const tooltipContent = `${contributionCount} contributions\n${dayOfWeek}, ${monthAndDate}`;
      grid.push(
        <div key={i} className={cellClass}>
          <div className="tooltip" title={tooltipContent}>
            <div className="tooltip-content">
              <div className="contribution-count">{contributionCount}</div>
              <div className="date-info">
                {dayOfWeek}, {monthAndDate}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return grid;
  };

  const renderMonthsList = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const monthsInOrder: string[] = [];

    for (let i = 0; i <= 11; i++) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const month = new Date(
        currentDate.getFullYear(),
        monthIndex,
        1
      ).toLocaleString("default", { month: "long" });

      monthsInOrder.push(month);
    }
    return monthsInOrder.reverse();
  };

  return (
    <>
      <div className="main">
        <div className="weeks">
          <p>Пн.</p>
          <p>Ср.</p>
          <p>Пт.</p>
        </div>
        <div className="block">
          <div className="date">
            {renderMonthsList().map((month, index) => (
              <p className="month" key={index}>
                {month}
              </p>
            ))}
          </div>
          <div className="contribution-graph">{renderContributions()}</div>
        </div>
      </div>
      <div className="end">
        <p>Меньше</p>
        <span className="no-contributions"></span>
        <span className="low-contributions"></span>
        <span className="medium-contributions "></span>
        <span className="high-contributions"></span>
        <span className="very-high-contributions"></span>
        <p>Больше</p>
      </div>
    </>
  );
};

export default ContributionGraph;
