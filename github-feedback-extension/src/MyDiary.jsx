import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardInfo,
  CardSection,
} from "./components/card";
import ApiService from "./services/api";
import styled from "@emotion/styled";
import { BoxChip } from "./components/box-chip";
import { Colors } from "./utils/colors";
import { addCustomDays, calenderConstantVal } from "./utils";
import { compareDesc, format, parseISO } from "date-fns";
import { FeedbackCard } from "./components/feedback-card";
import { Button, ButtonContainer } from "./components/button";
import { FEEDBACK_FORM, MY_DIARY } from "./App";
import Calendar from "./components/Calendar";

const CenteredDiv = styled.div`
  text-align: center;
`;

const CenteredHeading = styled(CenteredDiv)`
  font-size: 1.2em;
`;

const CenteredSubHeading = styled(CenteredHeading)`
  // Todo: use Nunito
  font-family: "Roboto-Thin", sans-serif;
  color: #aaa; // Todo: consult with design to check correct code
  font-weight: 300;
  margin-top: 12px;
  font-size: 1em;
`;

const BoxChipsContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 26px;
`;

const BottomBorderedCardSection = styled(CardSection)`
  border-bottom: 1px solid #dce0e4;
`;

const DateSection = styled(CenteredDiv)`
  font-size: 14px;
  font-family: "Roboto-Thin", sans-serif;
  font-weight: 300;
  margin-top: 20px;
`;

export const MyDiary = ({ onPageChange }) => {
  const [baseFeedBackList, setbaseFeedBackList] = useState([]);
  let [feedbackList, setFeedbackList] = useState([]);
  let [checkInStatus, setCheckInStatus] = useState({});
  const [isFeedbackListLoaded, setIsFeedbackListLoaded] = useState(false);
  const [isCheckInStatusLoaded, setIsCheckInStatusLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!isFeedbackListLoaded) {
      ApiService.get("/feedback")
        .then((res) => {
          if (isMounted) {
            let list = prepareFeedbackList(res.data);
            filterFeedBackListBasedOnSelectedDate({
              selectedDate: new Date(),
              format: calenderConstantVal.dateFormatOfDateMonthYear,
              addDayCount: 1,
              list,
            });
            setbaseFeedBackList(list);
            setIsFeedbackListLoaded(true);
          }
        })
        .catch((e) => {
          if (isMounted) {
            alert("Could not load feedback!");
            setIsFeedbackListLoaded(true);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isFeedbackListLoaded]);

  useEffect(() => {
    let isMounted = true;
    if (!isCheckInStatusLoaded) {
      ApiService.get("/check_in_status")
        .then((res) => {
          if (isMounted) {
            setCheckInStatus(res.data);
            setIsCheckInStatusLoaded(true);
          }
        })
        .catch(() => {
          if (isMounted) {
            alert("Could not load check in status!");
            setIsCheckInStatusLoaded(true);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isCheckInStatusLoaded]);

  // prepare feedBack list based on date fns format
  const prepareFeedbackList = (list) => {
    return list
      .map((f) => ({ ...f, created_at: parseISO(f.created_at) }))
      .sort((a, b) => compareDesc(a.created_at, b.created_at))
      .map((f) => ({
        ...f,
        date: format(f.created_at, "eeee MMM d"),
      }));
  };

  const feedbackKeyedByDate = feedbackList.reduce((grouped, feedback) => {
    let existing = [];
    if (grouped.has(feedback.date)) {
      existing = grouped.get(feedback.date);
    }

    grouped.set(feedback.date, [...existing, feedback]);

    return grouped;
  }, new Map());

  // update feedback list once user select date from calender
  const filterFeedBackListBasedOnSelectedDate = ({
    selectedDate,
    format,
    addDayCount,
    list,
  }) => {
    const { startDate, endDate } = addCustomDays(
      selectedDate,
      format,
      addDayCount
    );
    let selectedStartDate = new Date(startDate)?.toISOString();
    let selectedEndDate = new Date(endDate)?.toISOString();
    // using to prevent mutation on original list
    let deepClonedBaseFeedBackList = JSON.parse(
      JSON.stringify(list ? list : baseFeedBackList)
    );
    deepClonedBaseFeedBackList = deepClonedBaseFeedBackList?.filter(
      (item) =>
        item.created_at > selectedStartDate && item.created_at < selectedEndDate
    );
    setFeedbackList(prepareFeedbackList(deepClonedBaseFeedBackList));
  };

  return (
    <Card>
      <CardHeader dismissible>My Log</CardHeader>
      <CardBody>
        {(!isFeedbackListLoaded || !isCheckInStatusLoaded) && (
          <CenteredDiv>Loading...</CenteredDiv>
        )}
        {checkInStatus.isTodaysCheckInDone && (
          <BottomBorderedCardSection>
            <CardInfo>
              <CenteredHeading>Way to go!</CenteredHeading>
              <CenteredSubHeading>
                You've completed your daily checkin
              </CenteredSubHeading>
            </CardInfo>
            <BoxChipsContainer>
              <BoxChip
                title="Daily Checkin"
                text="Finished!"
                color={Colors.secondary2}
              />
              <BoxChip
                title="Current Streak"
                text={`${checkInStatus.currentStreak} Days 🔥`}
                color={Colors.primary}
              />
              <BoxChip
                title="Longest Streak"
                text={`${checkInStatus.longestStreak} Days`}
                color={Colors.purple2}
              />
            </BoxChipsContainer>
          </BottomBorderedCardSection>
        )}
        {/* Calendar Component */}
        <Calendar
          updateFeedBackListOnSelectedDate={
            filterFeedBackListBasedOnSelectedDate
          }
          feedBackList={baseFeedBackList}
        />
        <CardSection>
          {Array.from(feedbackKeyedByDate.entries()).map(
            ([date, feedbackItems]) => (
              <div key={date}>
                <DateSection>{date}</DateSection>
                {feedbackItems.map((f) => (
                  <FeedbackCard key={f.id} feedback={f} />
                ))}
              </div>
            )
          )}
        </CardSection>
      </CardBody>
      <CardFooter>
        <ButtonContainer>
          <Button primary onClick={() => onPageChange(FEEDBACK_FORM)}>
            Back
          </Button>
        </ButtonContainer>
      </CardFooter>
    </Card>
  );
};
