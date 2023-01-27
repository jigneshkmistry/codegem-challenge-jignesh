/* eslint-disable max-len */
import React, { useState } from "react";
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

import { calenderConstantVal } from "../utils";

const initialState = {
  currentMonth: new Date(),
  selectedDate: new Date(),
};

const Calendar = ({ updateFeedBackListOnSelectedDate, feedBackList }) => {
  const [state, setState] = useState(initialState);

  const updateState = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const renderHeader = () => {
    const dateFormat = calenderConstantVal.dateFormatOfMonthAndYear;

    return (
      <div className="header d-flex flex-row py-2">
        <div className="col col-start" onClick={prevMonth}>
          <div className="icon">{calenderConstantVal.leftIcon}</div>
        </div>
        <div className="col col-center">
          <span>{format(state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="icon">{calenderConstantVal.rightIcon}</div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = calenderConstantVal.dateFormatOfDaysOfWeek;
    const days = [];

    let startDate = startOfWeek(state.currentMonth, {
      weekStartsOn: 1,
    });

    Array.from({ length: calenderConstantVal.daysOfWeek })?.map(
      (item, index) => {
        days.push(
          <div className="days col col-center" key={index}>
            {format(addDays(startDate, index + 1), dateFormat)}
          </div>
        );
      }
    );

    return <div className="col-8 row py-2">{days}</div>;
  };

  // using to render empty view if there is not check-ins for selected date
  const renderEmptyCheckInsElement = () => (
    <div className="d-flex flex-row">
      <div className="d-flex flex-row align-items-center justify-content-center cirle-container">
        <div className="icon py-1">{calenderConstantVal.closeIcon}</div>
      </div>
    </div>
  );

  // using to indicate avg check-ins if there is check-ins exist for selected date
  const renderCheckInsElement = (checkInsCount) => (
    <div className="d-flex flex-row">
      {Array.from({
        length:
          checkInsCount > calenderConstantVal.maxToShowFeedBackCountCircle
            ? calenderConstantVal.maxToShowFeedBackCountCircle
            : checkInsCount,
      }).map((item, index) => (
        <div key={index} className="circle"></div>
      ))}
    </div>
  );

  const renderCells = () => {
    const { currentMonth, selectedDate } = state;
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = calenderConstantVal.dateFormatOfDate;
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    // using to create list of days of week
    while (day <= endDate) {
      Array.from({ length: calenderConstantVal.daysOfWeek }).map(() => {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        let { checkInsCount, avgSentiments } =
          calculateAvgSentimentsAndCheckInsCount(cloneDay);
        let todayCheckInIsEmpty =
          checkInsCount === 0 && isSameDay(day, new Date());
        days.push(
          <div
            className={`py-2 col col-center rounded calender-cell ${
              checkInsCount > 0 && renderClassBasedOnSentiments(avgSentiments)
            } ${renderClassBasedOnTimeAndCheckInsCount({
              day,
              monthStart,
              selectedDate,
              checkInsCount,
            })}`}
            key={day}
            onClick={() => {
              onDateClick(cloneDay);
            }}
          >
            <div className={`number ${todayCheckInIsEmpty ? "empty" : ""}`}>
              {todayCheckInIsEmpty ? "?" : formattedDate}
            </div>
            <div
              className={`position-absolute ${
                checkInsCount === 0 ? "bottom-0" : ""
              }`}
            >
              {checkInsCount > 0
                ? renderCheckInsElement(checkInsCount)
                : renderEmptyCheckInsElement()}
            </div>
          </div>
        );
        day = addDays(day, 1);
      });
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body row-gap col-12">{rows}</div>;
  };

  // using to show avg sentiments using background colors
  const renderClassBasedOnSentiments = (avgSentiment) => {
    let className = "";
    switch (true) {
      case avgSentiment < calenderConstantVal.neutralSentimentStartRange:
        className = "danger";
        break;
      case avgSentiment >= calenderConstantVal.neutralSentimentStartRange &&
        avgSentiment <= calenderConstantVal.neutralSentimentEndRange:
        className = "neutral";
        break;
      case avgSentiment >= calenderConstantVal.neutralSentimentEndRange:
        className = "positive";
        break;
      default:
        className = "";
        break;
    }
    return className;
  };

  // using to indicate check-ins based on time and list of check-ins of selected date
  const renderClassBasedOnTimeAndCheckInsCount = (timeAndCheckInParams) => {
    const { day, monthStart, selectedDate, checkInsCount } =
      timeAndCheckInParams;
    let returnClassName = "";
    switch (true) {
      case !isSameMonth(day, monthStart):
        returnClassName = "disabled";
        break;
      case isSameDay(day, selectedDate) && checkInsCount > 0:
        returnClassName = "selected";
        break;
      case isSameDay(day, selectedDate) && checkInsCount === 0:
        returnClassName = "noCheckInsExist selected";
        break;
      case !isSameDay(day, selectedDate) && checkInsCount > 0:
        returnClassName = "checkInsExist";
        break;
      default:
        returnClassName = "noCheckInsExist";
        break;
    }
    return returnClassName;
  };

  // using to calculate total number of check-ins and avg. sentiments of selected date
  const calculateAvgSentimentsAndCheckInsCount = (date) => {
    // using to prevent mutation on original list
    let deepClonedFeedBackList = JSON.parse(JSON.stringify(feedBackList));
    let filteredList = checkIfDateExist(deepClonedFeedBackList, date);
    let avgSentiments =
      filteredList?.length > 0 ? calculateAvgSentiments(filteredList) : 0;
    return { avgSentiments, checkInsCount: filteredList?.length };
  };

  const checkIfDateExist = (list, date) => {
    return list?.filter(
      (item) =>
        new Date(item?.created_at)?.getDate() +
          "/" +
          new Date(item?.created_at)?.getMonth() +
          "/" +
          new Date(item?.created_at)?.getFullYear() ===
        new Date(date)?.getDate() +
          "/" +
          new Date(date)?.getMonth() +
          "/" +
          new Date(date)?.getFullYear()
    );
  };

  const calculateAvgSentiments = (list) => {
    return parseInt(
      Math.round(
        list.reduce(function (acc, obj) {
          return acc + parseFloat(obj.average_sentiment);
        }, 0) / list.length
      )
    );
  };

  // using to update feedback list based on selected date from calendar
  const onDateClick = (day) => {
    updateState("selectedDate", day);
    updateFeedBackListOnSelectedDate({
      selectedDate: day,
      format: calenderConstantVal.dateFormatOfDateMonthYear,
      addDayCount: 1,
    });
  };

  // using to navigate user to next month
  const nextMonth = () => {
    updateState("currentMonth", addMonths(state.currentMonth, 1));
  };
  // using to navigate user to prev month
  const prevMonth = () => {
    updateState("currentMonth", subMonths(state.currentMonth, 1));
  };
  return (
    <div className="calendar col-md-12 col-sm-12 col-lg-12 col bg-white">
      {/* render selected month */}
      {renderHeader()}
      {/* render days of week */}
      {renderDays()}
      {/* render date of month */}
      {renderCells()}
    </div>
  );
};

export default Calendar;
