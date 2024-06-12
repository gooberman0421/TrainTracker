from sqlalchemy import create_engine, Column, Integer, String, DateTime, and_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///train_tracker.db")

engine = create_engine(DATABASE_URL, echo=True)

session_factory = sessionmaker(bind=engine)
Session = scoped_session(session_factory)

class Train(Base):
    __tablename__ = 'trains'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    departure = Column(DateTime)
    arrival = Column(DateTime)

def init_db():
    Base.metadata.create_all(bind=engine)

def drop_and_create_all():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def update_train(train_id, name=None, departure=None, arrival=None):
    session = Session()
    train = session.query(Train).filter(Train.id == train_id).first()
    if train:
        if name:
            train.name = name
        if departure:
            train.departure = departure
        if arrival:
            train.arrival = arrival
        session.commit()
        print(f"Train {train_id} updated successfully.")
    else:
        print(f"Train {train_id} not found.")
    session.close()

def query_trains_by_departure(start_date, end_date):
    session = Session()
    trains = session.query(Train).filter(
        and_(Train.departure >= start: date, Train.departure <= end_date)
    ).all()
    session.close()
    return trains

if __name__ == "__main__":
    init_db()