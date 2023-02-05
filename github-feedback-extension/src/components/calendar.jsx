import React, { useState } from "react";
import { DisplayCalendar } from "./display-calendar";
import { calenderConstantVal } from "../utils";
import { addMonths,subMonths,isSameDay,isSameMonth,
    format, startOfMonth, endOfMonth, endOfWeek, startOfWeek, addDays
} from "date-fns";


export const Calendar = (props) => {

    const [state, setState] = useState({
        selectedDate: new Date(),
    });

    const updateState = (key, value) => {
        setState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const nextMonth = () => {
        const selectedDate = addMonths(state.selectedDate, 1);
        onDateClick(selectedDate);
    };

    const prevMonth = () => {
        const selectedDate = subMonths(state.selectedDate, 1);
        onDateClick(selectedDate);
    };

    const calculateAvgSentiments = (list) => {
        return list && list.length > 0 ? parseInt(
            Math.round(
                list.reduce(function (acc, obj) {
                    return acc + parseFloat(obj.average_sentiment);
                }, 0) / list.length
            )
        ) : 0;
    };

    const getFeefbackByDate = (date) => {
        return props.feedBackList?.filter((item) =>
            new Date(item?.created_at)?.getDate() +
            "/" +
            new Date(item?.created_at)?.getMonth() +
            "/" +
            new Date(item?.created_at)?.getFullYear() ===
            date?.getDate() +
            "/" +
            date?.getMonth() +
            "/" +
            date?.getFullYear());
    };

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

    const renderClassBasedOnTimeAndCheckInsCount = (timeAndCheckInParams) => {
        const { day, monthStart, selectedDate, checkInsCount } =
            timeAndCheckInParams;
        let returnClassName = "";
        switch (true) {
            case !isSameMonth(day, monthStart):
                returnClassName = `prevMonth ${isSameDay(day, selectedDate) ? "selected" : ""
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

    const calculateMonthData = (currentMonth) => {

        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
        let day = startDate;
        let daysInWeek = [];
        const weeks = [];

        while (day <= endDate) {
            Array.from({ length: calenderConstantVal.daysOfWeek }).map(() => {

                let filteredList = getFeefbackByDate(day);
                let avgSentiments = calculateAvgSentiments(filteredList);
                let checkInsCount = filteredList?.length;
                let todayCheckInIsEmpty =
                    checkInsCount === 0 && isSameDay(day, new Date());

                daysInWeek.push({
                    day: day,
                    date: format(day, calenderConstantVal.dateFormatOfDate),
                    sentimentsClassName: checkInsCount > 0
                        && renderClassBasedOnSentiments(avgSentiments),
                    timeAndCheckInsClassName: renderClassBasedOnTimeAndCheckInsCount({
                        day,
                        monthStart,
                        selectedDate: currentMonth,
                        checkInsCount,
                    }),
                    todayCheckInIsEmptyClassName: todayCheckInIsEmpty ? "empty" : "",
                    checkInsCountClassName: checkInsCount === 0 ? "bottom-0" : "",
                    checkInsCount,
                    maxToShowFeedBackCountCircle: calenderConstantVal.maxToShowFeedBackCountCircle
                });
                day = addDays(day, 1);
            });
            weeks.push(daysInWeek);
            daysInWeek = [];
        }

        return weeks;
    };

    const onDateClick = (day) => {
        updateState("selectedDate", day);
        props.onSelectedDateChange(day);
    };

    const calendarData = {
        currentMonth: state.selectedDate,
        header: {
            month: format(state.selectedDate, calenderConstantVal.dateFormatOfMonthAndYear),
            prevMonth,
            nextMonth
        },
        body: {
            weeks: calculateMonthData(state.selectedDate),
            onDateClick
        }
    };

    return (
        <DisplayCalendar calendarData={calendarData}></DisplayCalendar>
    );
};