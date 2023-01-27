import React, {useEffect, useState} from 'react';
import {Card, CardBody, CardFooter, CardHeader, CardInfo, CardSection} from "./components/card";
import {EmojiSelector} from "./components/emoji-selector";
import {TagSelector} from "./components/tag-selector";
import {Button, ButtonContainer} from "./components/button";
import ApiService from "./services/api";
import FeedbackValidator from "./validators/feedback";
import {Container} from './components/container';
import styled from '@emotion/styled';
import {Textarea} from './components/textarea';
import {Toast} from './components/center-toast';
import {MY_DIARY} from "./App";

const CustomContainer = styled(Container)`
  min-height: 50px;
  margin-top: 10px;
`;

const CustomTextArea = styled(Textarea)`
  margin-top: 10px;
  height: 80px;
`;

export const FeedbackForm = ({onPageChange}) => {
    let [tags, setTags] = useState([]);
    const [isTagsLoaded, setIsTagsLoaded] = useState(false);
    let [moods, setMoods] = useState([]);
    let [feedback, setFeedback] = useState("");
    let [saving, setSaving] = useState(false);
    let [errors, setErrors] = useState(null);
    let [showSuccess, setShowSuccess] = useState(false);
    const source = window.location.href;

    useEffect(() => {
        let isMounted = true;
        if (!isTagsLoaded) {
            ApiService.get('/tags')
                .then((res) => {
                    if (isMounted) {
                        setTags(res.data);
                        setIsTagsLoaded(true);
                    }
                })
                .catch(() => {
                    if (isMounted) {
                        alert('Could not load tags!');
                        setIsTagsLoaded(true);
                    }
                });
        }
        return () => {
            isMounted = false;
        };
    }, [isTagsLoaded]);

    const onTagClicked = (tag) => {
        tag.active = !tag.active;
        setTags([...tags]);
    };

    const removeTag = (tag) => {
        onTagClicked(tag);
    };

    const submitForm = () => {
        let formValid = FeedbackValidator.validate(feedback, moods, tags);
        setErrors(null);

        if (formValid.valid) {
            setSaving(true);
            ApiService.post("/feedback", {
                moods: moods.map(m => m.id),
                tags: tags.map(t => t.id),
                feedback,
                source
            })
                .then(() => {
                    setSaving(false);
                    setMoods([]);
                    setTags([...tags.map(t => ({
                        ...t,
                        active: false,
                    }))]);
                    setFeedback("");
                    setShowSuccess(true);

                    setTimeout(() => setShowSuccess(false), 1000);
                });
        } else {
            setErrors(formValid);
        }
    };

    return (<Card>
        <Toast content="Your feedback has been submitted successfully." show={showSuccess}/>
        <CardHeader dismissible>
            Let's Reflect.
        </CardHeader>
        <CardBody>
            {
                !isTagsLoaded ?
                    <div>Loading...</div>
                    : <>
                        <CardSection>
                            <CardInfo>How are you feeling now?</CardInfo>
                            <EmojiSelector
                                selected={moods}
                                setSelected={setMoods}
                                error={errors && !errors.moods}/>
                        </CardSection>
                        <CardSection>
                            <CardInfo>What inspired that?</CardInfo>
                            <Container flex>
                                <TagSelector dismissOverride={false} onTagClicked={onTagClicked} selected={tags}/>
                            </Container>
                        </CardSection>
                        <CardSection>
                            <CardInfo>Your findings</CardInfo>
                            <CustomContainer bordered>
                                <TagSelector
                                    dismissOverride={true}
                                    onTagRemoved={removeTag}
                                    selected={tags.filter(t => !!t.active)}/>
                            </CustomContainer>
                        </CardSection>
                        <CardSection>
                            <CardInfo>Would you like to share more?</CardInfo>
                            <CustomTextArea
                                bordered
                                full
                                error={errors && !errors.feedback}
                                value={feedback}
                                onChange={e => setFeedback(e.target.value)}/>
                        </CardSection>
                    </>
            }

        </CardBody>
        <CardFooter>
            <ButtonContainer>
                <Button primary onClick={() => onPageChange(MY_DIARY)} disabled={saving}>My Diary</Button>
                <Button onClick={submitForm} disabled={saving}>Submit</Button>
            </ButtonContainer>
        </CardFooter>
    </Card>);
};
