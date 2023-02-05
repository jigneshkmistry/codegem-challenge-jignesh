/* eslint-disable max-len */
import React from "react";
import { format, addDays } from "date-fns";

const CalendarUI = (props) => {
  
  const renderHeader = (props) => {
    const {
      prevMonth,
      leftIcon,
      currentMonth,
      dateFormat,
      nextMonth,
      rightIcon,
    } = props.headerValues;
    return (
      <div className="header d-flex flex-row py-2">
        <div className="col col-start" onClick={prevMonth}>
          <div className="icon">{leftIcon}</div>
        </div>
        <div className="col col-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="icon">{rightIcon}</div>
        </div>
      </div>
    );
  };

  const renderDays = (props) => {
    const { dateFormat, startDate, daysOfWeek } = props.daysValues;
    return (
      <div className="col-8 row py-2">
        {Array.from({ length: daysOfWeek })?.map((item, index) => {
          return (
            <div className="days col col-center" key={index}>
              {format(addDays(startDate, index + 1), dateFormat)}
            </div>
          );
        })}
      </div>
    );
  };

  // using to indicate avg check-ins if there is check-ins exist for selected date
  const renderCheckInsElement = (
    checkInsCount,
    maxToShowFeedBackCountCircle
  ) => (
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
  const renderEmptyCheckInsElement = (closeIcon) => (
    <div className="d-flex flex-row">
      <div className="d-flex flex-row align-items-center justify-content-center cirle-container">
        <div className="icon py-1">{closeIcon}</div>
      </div>
    </div>
  );

  const renderCells = (props) => {
    const { rows } = props.cellsValues;
    return (
      <div className="body row-gap col-12">
        {rows.map((item, index) => (
          <div className="row" key={index}>
            {item.map((day, dayIndex) => (
              <div
                className={`py-2 col col-center rounded calender-cell ${day.sentimentsClassName} ${day.timeAndCheckInsClassName}`}
                key={dayIndex}
                onClick={() => {
                  day.onClick(day.cloneDay);
                }}
              >
                <div className={`number ${day.todayCheckInIsEmptyClassName}`}>
                  {day.date}
                </div>
                <div
                  className={`position-absolute ${day.checkInsCountClassName}`}
                >
                  {day.checkInsCount > 0
                    ? renderCheckInsElement(
                        day.checkInsCount,
                        day.maxToShowFeedBackCountCircle
                      )
                    : renderEmptyCheckInsElement(day.closeIcon)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar col-md-12 col-sm-12 col-lg-12 col bg-white">
      {/* render selected month */}
      {renderHeader(props)}
      {/* render days of week */}
      {renderDays(props)}
      {/* render date of month */}
      {renderCells(props)}
    </div>
  );
};

export default CalendarUI;
