import React from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { calenderConstantVal } from "../utils";

export const DisplayCalendar = (props) => {

    const renderHeader = (header) => {

        return (
            <div className="header d-flex flex-row py-2">
                <div className="col col-start" onClick={header.prevMonth}>
                    <div className="icon">chevron_left</div>
                </div>
                <div className="col col-center">
                    <span>{header.month}</span>
                </div>
                <div className="col col-end" onClick={header.nextMonth}>
                    <div className="icon">chevron_right</div>
                </div>
            </div>
        );
    };

    const renderDays = () => {

        const firstDOW = startOfWeek(new Date());
        return (
            <div className="col-8 row py-2">
                {
                    Array.from(Array(calenderConstantVal.daysOfWeek)).map((e, index) => {
                        return (<div className="days col col-center" key={index}>
                            {format(addDays(firstDOW, index), calenderConstantVal.dateFormatOfDaysOfWeek)}
                        </div>);
                    })
                }
            </div>
        );
    };

    const renderCells = (props) => {

        return (
            <div className="body row-gap col-12">
                {
                    <div className="row">
                        {
                            props.weeks.map((item, index) => (
                                <div className="row" key={index}>
                                    {
                                        item.map((day, dayIndex) => (
                                            <div className={`py-2 col col-center rounded calender-cell 
                                                ${day.sentimentsClassName}  ${day.timeAndCheckInsClassName}`}
                                                key={dayIndex}
                                                onClick={() => {
                                                    props.onDateClick(day.day);
                                                  }}>
                                                <div className={`number ${day.todayCheckInIsEmptyClassName}`}>
                                                    {day.date}
                                                </div>
                                                <div className={`position-absolute ${day.checkInsCountClassName}`}>
                                                    {day.checkInsCount > 0
                                                        ? renderCheckInsElement(
                                                            day.checkInsCount,
                                                            day.maxToShowFeedBackCountCircle
                                                        )
                                                        : renderEmptyCheckInsElement()}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        );
    };

    // using to indicate avg check-ins if there is check-ins exist for selected date
    const renderCheckInsElement = (checkInsCount, maxToShowFeedBackCountCircle) => (
        <div className="d-flex flex-row">
            {Array.from({
                length:
                    checkInsCount > maxToShowFeedBackCountCircle
                        ? maxToShowFeedBackCountCircle
                        : checkInsCount,
            }).map((item, index) => (
                <div key={index} className="circle"></div>
            ))}
        </div>
    );

    // using to render empty view if there is not check-ins for selected date
    const renderEmptyCheckInsElement = () => (
        <div className="d-flex flex-row">
            <div className="d-flex flex-row align-items-center justify-content-center cirle-container">
                <div className="icon py-1">close</div>
            </div>
        </div>
    );

    return (
        <div className="calendar col-md-12 col-sm-12 col-lg-12 col bg-white">

            {/* render selected month */}
            {renderHeader(props.calendarData.header)}

            {/* render days of week */}
            {renderDays()}

            {/* render date of month */}
            {renderCells(props.calendarData.body)}

        </div>
    );
};