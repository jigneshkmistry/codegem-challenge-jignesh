import React, {useState} from "react";
import {FeedbackForm} from "./FeedbackForm";
import {MyDiary} from "./MyDiary";

export const FEEDBACK_FORM = 'FEEDBACK_FORM';
export const MY_DIARY = 'MY_DIARY';

export const App = () => {
    const [page, setPage] = useState(FEEDBACK_FORM);

    switch (page) {
        case MY_DIARY:
            return <MyDiary onPageChange={setPage} />;
        case FEEDBACK_FORM:
        default:
            return <FeedbackForm onPageChange={setPage} />;
    }
};
