from __future__ import annotations
from datetime import datetime
from typing import List, Optional
from sqlalchemy import (
   String,
   Integer,
   DateTime,
   ForeignKey,
   Text,
   Float,
   UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .db import Base

class User(Base):
   __tablename__ = "users"
   id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
   email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
   password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
   created_utc: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
   inputs: Mapped[List["UserInput"]] = relationship(
       "UserInput", back_populates="user", cascade="all, delete-orphan"
   )
   profile: Mapped["UserProfile"] = relationship(
       "UserProfile", back_populates="user", cascade="all, delete-orphan", uselist=False
   )

class UserProfile(Base):
   __tablename__ = "user_profiles"
   __table_args__ = (UniqueConstraint("user_id", name="uq_user_profiles_user_id"),)
   id: Mapped[int] = mapped_column(Integer, primary_key=True)
   user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
   display_name: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
   dark_mode: Mapped[Optional[str]] = mapped_column(String(16), nullable=True)  
   user: Mapped["User"] = relationship("User", back_populates="profile")

class UserInput(Base):
   __tablename__ = "user_inputs"
   id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
   user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
   product_url: Mapped[str] = mapped_column(String(2048), nullable=False)
   created_utc: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
   user: Mapped["User"] = relationship("User", back_populates="inputs")
   product_snapshot: Mapped["ProductSnapshot"] = relationship(
       "ProductSnapshot", back_populates="user_input", cascade="all, delete-orphan", uselist=False
   )
   review_snapshot: Mapped["ReviewSnapshot"] = relationship(
       "ReviewSnapshot", back_populates="user_input", cascade="all, delete-orphan", uselist=False
   )
   coupon_result: Mapped["CouponResult"] = relationship(
       "CouponResult", back_populates="user_input", cascade="all, delete-orphan", uselist=False
   )
   comparison_result: Mapped["ComparisonResult"] = relationship(
       "ComparisonResult", back_populates="user_input", cascade="all, delete-orphan", uselist=False
   )

class ProductSnapshot(Base):
   __tablename__ = "product_snapshots"
   id: Mapped[int] = mapped_column(Integer, primary_key=True)
   user_input_id: Mapped[int] = mapped_column(ForeignKey("user_inputs.id"), nullable=False, index=True)
   site: Mapped[str] = mapped_column(String(64), nullable=False)
   title: Mapped[str] = mapped_column(String(512), nullable=False)
   specs_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
   dimensions_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
   price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
   currency: Mapped[Optional[str]] = mapped_column(String(8), nullable=True)
   image_url: Mapped[Optional[str]] = mapped_column(String(2048), nullable=True)
   user_input: Mapped["UserInput"] = relationship("UserInput", back_populates="product_snapshot")

class ReviewSnapshot(Base):
   __tablename__ = "review_snapshots"
   id: Mapped[int] = mapped_column(Integer, primary_key=True)
   user_input_id: Mapped[int] = mapped_column(ForeignKey("user_inputs.id"), nullable=False, index=True)
   average_rating: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
   review_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
   sample_reviews_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
   user_input: Mapped["UserInput"] = relationship("UserInput", back_populates="review_snapshot")

class CouponResult(Base):
   __tablename__ = "coupon_results"
   id: Mapped[int] = mapped_column(Integer, primary_key=True)
   user_input_id: Mapped[int] = mapped_column(ForeignKey("user_inputs.id"), nullable=False, index=True)
   created_utc: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
   source: Mapped[str] = mapped_column(String(64), nullable=False, default="LocalDataset")
   matched_domain: Mapped[str] = mapped_column(String(255), nullable=False)
   matched_keywords: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
   coupons_json: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
   user_input: Mapped["UserInput"] = relationship("UserInput", back_populates="coupon_result")

class ComparisonResult(Base):
   __tablename__ = "comparison_results"
   id: Mapped[int] = mapped_column(Integer, primary_key=True)
   user_input_id: Mapped[int] = mapped_column(ForeignKey("user_inputs.id"), nullable=False, index=True)
   created_utc: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
   similar_items_json: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
   best_value_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
   user_input: Mapped["UserInput"] = relationship("UserInput", back_populates="comparison_result")