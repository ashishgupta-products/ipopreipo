'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { IpoItem, IpoCategory } from '../../types';
import IpoLogo from './IpoLogo';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Flame,
  ShieldCheck,
  Filter,
  List,
  Grid,
  Info
} from 'lucide-react';

export type MilestoneType = 'ALL' | 'OPEN' | 'CLOSE' | 'ALLOTMENT' | 'LISTING';

export interface CalendarEvent {
  id: string;
  ipo: IpoItem;
  type: 'OPEN' | 'CLOSE' | 'ALLOTMENT' | 'LISTING';
  dateStr: string;
  dateObj: Date;
  dateKey: string; // "YYYY-MM-DD"
  title: string;
}

interface IpoCalendarProps {
  ipos: IpoItem[];
  onSelectIpo?: (ipo: IpoItem) => void;
  onOpenAllotmentHub?: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

function parseDate(str?: string): Date | null {
  if (!str || str === 'TBA' || str.includes('announced') || str.includes('after Close')) {
    return null;
  }
  const isoMatch = str.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
  }
  const clean = str.replace(/(st|nd|rd|th)/gi, '').trim();
  const dmy = clean.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (dmy) {
    const day = parseInt(dmy[1]);
    const mStr = dmy[2].substring(0, 3).toLowerCase();
    const year = parseInt(dmy[3]);
    if (MONTH_MAP[mStr] !== undefined) {
      return new Date(year, MONTH_MAP[mStr], day);
    }
  }
  return null;
}

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function IpoCalendar({ ipos, onSelectIpo, onOpenAllotmentHub }: IpoCalendarProps) {
  // Base date for navigation
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => formatDateKey(today), [today]);

  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState<string>(todayKey);
  const [viewMode, setViewMode] = useState<'GRID' | 'TIMELINE'>('GRID');
  const [milestoneFilter, setMilestoneFilter] = useState<MilestoneType>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<IpoCategory | 'ALL'>('ALL');

  // Extract all calendar events from IPOs
  const allEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    ipos.forEach((ipo) => {
      // 1. Bidding Starts (Open)
      const openDate = parseDate(ipo.timeline.biddingStarts);
      if (openDate) {
        events.push({
          id: `${ipo.id}-open`,
          ipo,
          type: 'OPEN',
          dateStr: ipo.timeline.biddingStarts,
          dateObj: openDate,
          dateKey: formatDateKey(openDate),
          title: `${ipo.name} Opens for Bidding`
        });
      }

      // 2. Bidding Ends (Close)
      const closeDate = parseDate(ipo.timeline.biddingEnds);
      if (closeDate) {
        events.push({
          id: `${ipo.id}-close`,
          ipo,
          type: 'CLOSE',
          dateStr: ipo.timeline.biddingEnds,
          dateObj: closeDate,
          dateKey: formatDateKey(closeDate),
          title: `${ipo.name} Bidding Closes`
        });
      }

      // 3. Allotment Finalization
      const allotDate = parseDate(ipo.timeline.allotmentFinalization);
      if (allotDate) {
        events.push({
          id: `${ipo.id}-allotment`,
          ipo,
          type: 'ALLOTMENT',
          dateStr: ipo.timeline.allotmentFinalization,
          dateObj: allotDate,
          dateKey: formatDateKey(allotDate),
          title: `${ipo.name} Allotment Finalization`
        });
      }

      // 4. Listing Date
      const listDate = parseDate(ipo.timeline.listingDate);
      if (listDate) {
        events.push({
          id: `${ipo.id}-listing`,
          ipo,
          type: 'LISTING',
          dateStr: ipo.timeline.listingDate,
          dateObj: listDate,
          dateKey: formatDateKey(listDate),
          title: `${ipo.name} Stock Listing (NSE/BSE)`
        });
      }
    });

    return events.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  }, [ipos]);

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      if (milestoneFilter !== 'ALL' && ev.type !== milestoneFilter) return false;
      if (categoryFilter !== 'ALL' && ev.ipo.category !== categoryFilter) return false;
      return true;
    });
  }, [allEvents, milestoneFilter, categoryFilter]);

  // Events map by dateKey for fast lookup in grid cells
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    filteredEvents.forEach((ev) => {
      const list = map.get(ev.dateKey) || [];
      list.push(ev);
      map.set(ev.dateKey, list);
    });
    return map;
  }, [filteredEvents]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleTodayJump = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDateKey(todayKey);
  };

  // Generate calendar days matrix
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Day of week: 0 = Sun, 1 = Mon ... In Indian markets, week starts on Monday
    let startDayOfWeek = firstDayOfMonth.getDay();
    // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const daysCount = lastDayOfMonth.getDate();
    const days: Array<{
      dayNumber: number;
      dateKey: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: CalendarEvent[];
    }> = [];

    // Previous month filler days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dNum = prevMonthLastDay - i;
      const prevDate = new Date(currentYear, currentMonth - 1, dNum);
      const key = formatDateKey(prevDate);
      days.push({
        dayNumber: dNum,
        dateKey: key,
        isCurrentMonth: false,
        isToday: key === todayKey,
        events: eventsByDate.get(key) || []
      });
    }

    // Current month days
    for (let d = 1; d <= daysCount; d++) {
      const curDate = new Date(currentYear, currentMonth, d);
      const key = formatDateKey(curDate);
      days.push({
        dayNumber: d,
        dateKey: key,
        isCurrentMonth: true,
        isToday: key === todayKey,
        events: eventsByDate.get(key) || []
      });
    }

    // Next month filler days to complete grid (multiples of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(currentYear, currentMonth + 1, d);
      const key = formatDateKey(nextDate);
      days.push({
        dayNumber: d,
        dateKey: key,
        isCurrentMonth: false,
        isToday: key === todayKey,
        events: eventsByDate.get(key) || []
      });
    }

    return days;
  }, [currentYear, currentMonth, eventsByDate, todayKey]);

  // Selected date events
  const selectedDateEvents = useMemo(() => {
    return eventsByDate.get(selectedDateKey) || [];
  }, [eventsByDate, selectedDateKey]);

  // Human readable label for selected date
  const selectedDateLabel = useMemo(() => {
    const parts = selectedDateKey.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    return selectedDateKey;
  }, [selectedDateKey]);

  // Counts for quick metric badges
  const metrics = useMemo(() => {
    let openCount = 0;
    let closeCount = 0;
    let allotmentCount = 0;
    let listingCount = 0;

    filteredEvents.forEach((ev) => {
      if (ev.type === 'OPEN') openCount++;
      if (ev.type === 'CLOSE') closeCount++;
      if (ev.type === 'ALLOTMENT') allotmentCount++;
      if (ev.type === 'LISTING') listingCount++;
    });

    return { openCount, closeCount, allotmentCount, listingCount };
  }, [filteredEvents]);

  // Milestone styling helper
  const getMilestoneStyle = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'OPEN':
        return {
          bg: '#ecfdf5',
          border: '#a7f3d0',
          text: '#065f46',
          dot: '#10b981',
          label: 'Bidding Starts'
        };
      case 'CLOSE':
        return {
          bg: '#fff1f2',
          border: '#fecdd3',
          text: '#9f1239',
          dot: '#f43f5e',
          label: 'Bidding Closes'
        };
      case 'ALLOTMENT':
        return {
          bg: '#f5f3ff',
          border: '#ddd6fe',
          text: '#5b21b6',
          dot: '#8b5cf6',
          label: 'Allotment Out'
        };
      case 'LISTING':
        return {
          bg: '#fffbeb',
          border: '#fde68a',
          text: '#92400e',
          dot: '#f59e0b',
          label: 'Stock Listing'
        };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner & Control Deck */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem 1.5rem',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Header Title & Mode Switches */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #bfdbfe'
              }}>
                <CalendarIcon size={18} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                IPO Market Event Calendar
              </h2>
              <span className="glass-badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                SEBI Timeline
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              Live schedules for Issue Bidding, Official Allotment Releases, and NSE/BSE Listing dates.
            </p>
          </div>

          {/* View Mode Toggle: Grid vs Timeline */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setViewMode('GRID')}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                color: viewMode === 'GRID' ? '#ffffff' : '#64748b',
                backgroundColor: viewMode === 'GRID' ? '#2563eb' : 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Grid size={14} />
              <span>Month Grid</span>
            </button>
            <button
              onClick={() => setViewMode('TIMELINE')}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                color: viewMode === 'TIMELINE' ? '#ffffff' : '#64748b',
                backgroundColor: viewMode === 'TIMELINE' ? '#2563eb' : 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <List size={14} />
              <span>Upcoming Agenda</span>
            </button>
          </div>
        </div>

        {/* Milestone Quick Summary Chips */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          paddingTop: '0.75rem',
          borderTop: '1px solid #f1f5f9'
        }}>
          <button
            onClick={() => setMilestoneFilter('ALL')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: milestoneFilter === 'ALL' ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
              backgroundColor: milestoneFilter === 'ALL' ? '#eff6ff' : '#f8fafc',
              color: milestoneFilter === 'ALL' ? '#1d4ed8' : '#64748b',
              transition: 'all 0.15s ease'
            }}
          >
            All Events ({filteredEvents.length})
          </button>

          <button
            onClick={() => setMilestoneFilter('OPEN')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: milestoneFilter === 'OPEN' ? '1.5px solid #10b981' : '1px solid #e2e8f0',
              backgroundColor: milestoneFilter === 'OPEN' ? '#ecfdf5' : '#f8fafc',
              color: milestoneFilter === 'OPEN' ? '#047857' : '#64748b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            <span>Bidding Open ({metrics.openCount})</span>
          </button>

          <button
            onClick={() => setMilestoneFilter('CLOSE')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: milestoneFilter === 'CLOSE' ? '1.5px solid #f43f5e' : '1px solid #e2e8f0',
              backgroundColor: milestoneFilter === 'CLOSE' ? '#fff1f2' : '#f8fafc',
              color: milestoneFilter === 'CLOSE' ? '#be123c' : '#64748b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f43f5e' }}></span>
            <span>Bidding Closes ({metrics.closeCount})</span>
          </button>

          <button
            onClick={() => setMilestoneFilter('ALLOTMENT')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: milestoneFilter === 'ALLOTMENT' ? '1.5px solid #8b5cf6' : '1px solid #e2e8f0',
              backgroundColor: milestoneFilter === 'ALLOTMENT' ? '#f5f3ff' : '#f8fafc',
              color: milestoneFilter === 'ALLOTMENT' ? '#6d28d9' : '#64748b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#8b5cf6' }}></span>
            <span>Allotment Date ({metrics.allotmentCount})</span>
          </button>

          <button
            onClick={() => setMilestoneFilter('LISTING')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: milestoneFilter === 'LISTING' ? '1.5px solid #f59e0b' : '1px solid #e2e8f0',
              backgroundColor: milestoneFilter === 'LISTING' ? '#fffbeb' : '#f8fafc',
              color: milestoneFilter === 'LISTING' ? '#b45309' : '#64748b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
            <span>Exchange Listing ({metrics.listingCount})</span>
          </button>

          {/* Segment Filter (Mainboard vs SME) */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Segment:</span>
            <select
              aria-label="Filter events by IPO segment"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#1e293b',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-sm)',
                padding: '0.3rem 0.6rem',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Categories</option>
              <option value="MAINBOARD">🏢 Mainboard</option>
              <option value="SME">🚀 SME</option>
            </select>
          </div>
        </div>
      </div>

      {/* Check Allotment Direct Callout Ribbon */}
      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: 'var(--radius-lg)',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={18} color="#059669" />
          <span style={{ fontSize: '0.84rem', color: '#065f46', fontWeight: 600 }}>
            Looking for Allotment Status? <strong>15 IPOs recently closed</strong> and are finalizing allocation.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link
            href="/allotment"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#059669',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              transition: 'background 0.15s ease'
            }}
          >
            <span>Open Allotment Portal</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* VIEW 1: MONTH CALENDAR GRID */}
      {viewMode === 'GRID' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          {/* Calendar Month Navigation Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, minWidth: '170px' }}>
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h3>

              <button
                onClick={handleNextMonth}
                aria-label="Next Month"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <button
              onClick={handleTodayJump}
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#2563eb',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.75rem',
                cursor: 'pointer'
              }}
            >
              Today
            </button>
          </div>

          {/* Weekdays Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '6px',
            marginBottom: '6px',
            textAlign: 'center'
          }}>
            {WEEKDAYS.map((wd, i) => (
              <div
                key={wd}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: i >= 5 ? '#94a3b8' : '#64748b',
                  padding: '0.35rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {wd}
              </div>
            ))}
          </div>

          {/* 7-column Calendar Matrix */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '6px'
          }}>
            {calendarDays.map((cell, idx) => {
              const isSelected = cell.dateKey === selectedDateKey;

              return (
                <div
                  key={`${cell.dateKey}-${idx}`}
                  onClick={() => setSelectedDateKey(cell.dateKey)}
                  style={{
                    minHeight: '88px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected
                      ? '2px solid #2563eb'
                      : cell.isToday
                      ? '1.5px solid #10b981'
                      : '1px solid #e2e8f0',
                    backgroundColor: isSelected
                      ? '#eff6ff'
                      : cell.isToday
                      ? '#f0fdf4'
                      : cell.isCurrentMonth
                      ? '#ffffff'
                      : '#f8fafc',
                    padding: '0.4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    opacity: cell.isCurrentMonth ? 1 : 0.45,
                    boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.15)' : 'none'
                  }}
                >
                  {/* Date number header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    fontWeight: cell.isToday || isSelected ? 800 : 600,
                    color: cell.isToday ? '#059669' : isSelected ? '#1d4ed8' : cell.isCurrentMonth ? '#1e293b' : '#94a3b8'
                  }}>
                    <span>{cell.dayNumber}</span>
                    {cell.isToday && (
                      <span style={{
                        fontSize: '0.6rem',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}>
                        Today
                      </span>
                    )}
                  </div>

                  {/* Event Chips List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
                    {cell.events.slice(0, 2).map((ev) => {
                      const style = getMilestoneStyle(ev.type);
                      return (
                        <div
                          key={ev.id}
                          title={`${ev.title} - ${ev.ipo.name} (${style.label})`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            backgroundColor: style.bg,
                            border: `1px solid ${style.border}`,
                            color: style.text,
                            borderRadius: '4px',
                            padding: '1px 4px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: style.dot,
                            flexShrink: 0
                          }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ev.ipo.name.split(' ')[0]}
                          </span>
                        </div>
                      );
                    })}
                    {cell.events.length > 2 && (
                      <span style={{
                        fontSize: '0.62rem',
                        color: '#64748b',
                        fontWeight: 700,
                        paddingLeft: '2px'
                      }}>
                        +{cell.events.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Date Event Inspector */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="#2563eb" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Events for {selectedDateLabel}
                </h4>
                {selectedDateKey === todayKey && (
                  <span className="glass-badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                    Today
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {selectedDateEvents.length} event{selectedDateEvents.length === 1 ? '' : 's'} scheduled
              </span>
            </div>

            {selectedDateEvents.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-lg)',
                border: '1px dashed #cbd5e1'
              }}>
                <Info size={24} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>
                  No market events scheduled on this date
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Select dates marked with color dots above or switch to Upcoming Agenda view.
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                gap: '0.85rem'
              }}>
                {selectedDateEvents.map((ev) => {
                  const style = getMilestoneStyle(ev.type);
                  const ipo = ev.ipo;
                  const gmpPercent = ((ipo.gmp / (ipo.priceBandHigh || 1)) * 100);

                  return (
                    <div
                      key={ev.id}
                      className="glass-panel"
                      style={{
                        padding: '1rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.75rem'
                      }}
                    >
                      {/* Top Milestone Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: style.bg,
                          border: `1px solid ${style.border}`,
                          color: style.text,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: style.dot }} />
                          <span>{style.label}</span>
                        </div>

                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: ipo.category === 'SME' ? '#b45309' : '#2563eb',
                          backgroundColor: ipo.category === 'SME' ? '#fffbeb' : '#eff6ff',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: ipo.category === 'SME' ? '1px solid #fde68a' : '1px solid #bfdbfe'
                        }}>
                          {ipo.category}
                        </span>
                      </div>

                      {/* Company Info */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <IpoLogo name={ipo.name} symbol={ipo.symbol} logoUrl={ipo.logoUrl} size={38} />
                        <div>
                          <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                            {ipo.name}
                          </h5>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            {ipo.symbol} • {ipo.exchange}
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics Strip */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.5rem',
                        backgroundColor: '#f8fafc',
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.74rem'
                      }}>
                        <div>
                          <div style={{ color: '#64748b', fontSize: '0.68rem' }}>Price Band</div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>₹{ipo.priceBandHigh}</div>
                        </div>
                        <div>
                          <div style={{ color: '#64748b', fontSize: '0.68rem' }}>Live GMP</div>
                          <div style={{ fontWeight: 700, color: ipo.gmp >= 0 ? '#059669' : '#dc2626' }}>
                            {ipo.gmp >= 0 ? `+₹${ipo.gmp}` : `₹${ipo.gmp}`}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#64748b', fontSize: '0.68rem' }}>Est. Gain</div>
                          <div style={{ fontWeight: 700, color: gmpPercent >= 0 ? '#059669' : '#dc2626' }}>
                            {gmpPercent >= 0 ? `+${gmpPercent.toFixed(1)}%` : `${gmpPercent.toFixed(1)}%`}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.4rem' }}>
                        {ev.type === 'ALLOTMENT' || ipo.status === 'CLOSED' ? (
                          <a
                            href={ipo.registrarUrl || 'https://linkintime.co.in/initial_offer/public-issues.html'}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              flex: 1,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem',
                              backgroundColor: '#059669',
                              color: '#ffffff',
                              padding: '0.45rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              textDecoration: 'none'
                            }}
                          >
                            <ShieldCheck size={14} />
                            <span>Check Allotment</span>
                          </a>
                        ) : null}

                        <button
                          onClick={() => onSelectIpo && onSelectIpo(ipo)}
                          style={{
                            flex: 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            padding: '0.45rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <span>IPO Details</span>
                          <ExternalLink size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: UPCOMING AGENDA / TIMELINE */}
      {viewMode === 'TIMELINE' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
            Chronological Market Agenda
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredEvents.map((ev) => {
              const style = getMilestoneStyle(ev.type);
              const ipo = ev.ipo;
              const isToday = ev.dateKey === todayKey;
              const gmpPercent = ((ipo.gmp / (ipo.priceBandHigh || 1)) * 100);

              return (
                <div
                  key={ev.id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    border: isToday ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                    backgroundColor: isToday ? '#f0fdf4' : '#ffffff',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Left: Date & Milestone Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '54px',
                      height: '54px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isToday ? '#10b981' : '#f1f5f9',
                      color: isToday ? '#ffffff' : '#0f172a',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: '1.1rem', lineHeight: '1' }}>{ev.dateObj.getDate()}</span>
                      <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {MONTH_NAMES[ev.dateObj.getMonth()].substring(0, 3)}
                      </span>
                    </div>

                    <div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor: style.bg,
                        border: `1px solid ${style.border}`,
                        color: style.text,
                        padding: '1px 7px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        marginBottom: '3px'
                      }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: style.dot }} />
                        <span>{style.label}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {isToday ? 'Today' : ev.dateStr}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Company Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '220px' }}>
                    <IpoLogo name={ipo.name} symbol={ipo.symbol} logoUrl={ipo.logoUrl} size={40} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {ipo.name}
                        </h4>
                        <span style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          color: ipo.category === 'SME' ? '#b45309' : '#2563eb',
                          backgroundColor: ipo.category === 'SME' ? '#fffbeb' : '#eff6ff',
                          padding: '1px 5px',
                          borderRadius: '4px'
                        }}>
                          {ipo.category}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        ₹{ipo.priceBandLow} - ₹{ipo.priceBandHigh} • Lot: {ipo.lotSize} sh • Issue: ₹{ipo.issueSizeCr} Cr
                      </div>
                    </div>
                  </div>

                  {/* Right: GMP & Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Live GMP</div>
                      <div style={{
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        color: ipo.gmp >= 0 ? '#059669' : '#dc2626'
                      }}>
                        {ipo.gmp >= 0 ? `+₹${ipo.gmp} (+${gmpPercent.toFixed(1)}%)` : `₹${ipo.gmp}`}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {(ev.type === 'ALLOTMENT' || ipo.status === 'CLOSED') && (
                        <a
                          href={ipo.registrarUrl || 'https://linkintime.co.in/initial_offer/public-issues.html'}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            backgroundColor: '#059669',
                            color: '#ffffff',
                            padding: '0.45rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textDecoration: 'none'
                          }}
                        >
                          <ShieldCheck size={13} />
                          <span>Allotment</span>
                        </a>
                      )}

                      <button
                        onClick={() => onSelectIpo && onSelectIpo(ipo)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          padding: '0.45rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <span>Details</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
