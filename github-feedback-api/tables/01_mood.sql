create table if not exists mood
(
    id int generated by default as identity,
    emoji character(1) not null,
    emoji_name varchar(30) not null,
    sentiment_value smallint not null,
    primary key(id)
);

