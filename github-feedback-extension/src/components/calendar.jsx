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
import CalendarUI from "./calenderUI";

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
    return {
      prevMonth: prevMonth,
      currentMonth: state.currentMonth,
      nextMonth: nextMonth,
      leftIcon: calenderConstantVal.leftIcon,
      rightIcon: calenderConstantVal.rightIcon,
      dateFormat: calenderConstantVal.dateFormatOfMonthAndYear,
    };
  };

  const renderDays = () => {
    let startDate = startOfWeek(state.currentMonth, {
      weekStartsOn: 0,
    });
    return {
      dateFormat: calenderConstantVal.dateFormatOfDaysOfWeek,
      startDate: startDate,
      daysOfWeek: calenderConstantVal.daysOfWeek,
    };
  };

  const renderCells = () => {
    const { currentMonth, selectedDate } = state;
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = calenderConstantVal.dateFormatOfDate;
    const rows = [];
    let day = startDate;
    let formattedDate = "";
    let days = [];

    // using to create list of days of week
    while (day <= endDate) {
      Array.from({ length: calenderConstantVal.daysOfWeek }).map(() => {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        let { checkInsCount, avgSentiments } =
          calculateAvgSentimentsAndCheckInsCount(cloneDay);
        let todayCheckInIsEmpty =
          checkInsCount === 0 && isSameDay(day, new Date());
        days.push({
          day: day,
          onClick: onDateClick,
          cloneDay: cloneDay,
          sentimentsClassName:
            checkInsCount > 0 && renderClassBasedOnSentiments(avgSentiments),
          timeAndCheckInsClassName: renderClassBasedOnTimeAndCheckInsCount({
            day,
            monthStart,
            selectedDate,
            checkInsCount,
          }),
          todayCheckInIsEmptyClassName: todayCheckInIsEmpty ? "empty" : "",
          date: todayCheckInIsEmpty ? "?" : formattedDate,
          checkInsCountClassName: checkInsCount === 0 ? "bottom-0" : "",
          checkInsCount: checkInsCount,
          maxToShowFeedBackCountCircle:
            calenderConstantVal.maxToShowFeedBackCountCircle,
          closeIcon: calenderConstantVal.closeIcon,
        });
        day = addDays(day, 1);
      });
      rows.push(days);
      days = [];
    }
    return {
      rows: rows,
    };
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
        returnClassName = `prevMonth ${
          isSameDay(day, selectedDate) ? "selected" : ""
        }`;
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
 
    let filteredList = feedBackList?.filter((item) =>
      new Date(item?.created_at)?.getDate() +
      "/" +
      new Date(item?.created_at)?.getMonth() +
      "/" +
      new Date(item?.created_at)?.getFullYear() ===
      new Date(date)?.getDate() +
      "/" +
      new Date(date)?.getMonth() +
      "/" +
      new Date(date)?.getFullYear())

    let avgSentiments =
      filteredList?.length > 0 ? calculateAvgSentiments(filteredList) : 0;
    return { avgSentiments, checkInsCount: filteredList?.length };
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
    updateFeedBackListOnSelectedDate(day);
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
    <>
      {/* render calender presentational component */}
      <CalendarUI
        headerValues={renderHeader()}
        daysValues={renderDays()}
        cellsValues={renderCells()}
      />
    </>
  );
};

export default Calendar;
