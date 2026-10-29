"use client";
import { useId, useRef } from "react";
import {
  allDay,
  inherited,
  scheduleText,
  validateSchedule,
  SCHEDULE_LABEL,
  type DailySchedule,
} from "../../lib/daily-schedule";
import { Button } from "../ui/button";
export function ScheduleEditor({
  value,
  onChange,
  campaign,
  disabled = false,
}: {
  value: DailySchedule;
  onChange: (s: DailySchedule) => void;
  campaign?: DailySchedule;
  disabled?: boolean;
}) {
  const id = useId();
  const retained = useRef([{ startMinute: 540, endMinute: 1020 }]);
  if (value.mode === "custom") retained.current = value.ranges;
  let error = "";
  try {
    validateSchedule(value, !!campaign);
  } catch (e) {
    error = (e as Error).message;
  }
  const time = (m: number) =>
    Number.isFinite(m)
      ? `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`
      : "";
  const modes = campaign
    ? ["inherit", "round_the_clock", "custom"]
    : ["round_the_clock", "custom"];
  return (
    <fieldset
      className="cf-schedule"
      disabled={disabled}
      aria-describedby={`${id}-hint ${error ? id + "-error" : ""}`}
    >
      <legend>Daily ad schedule</legend>
      <p id={`${id}-hint`}>{SCHEDULE_LABEL}</p>
      <div className="cf-schedule-modes">
        {modes.map((mode) => (
          <label key={mode}>
            <input
              type="radio"
              name={id}
              checked={value.mode === mode}
              onChange={() =>
                onChange(
                  mode === "inherit"
                    ? inherited()
                    : mode === "round_the_clock"
                      ? allDay()
                      : {
                          version: 1,
                          mode: "custom",
                          timezone: "Africa/Lagos",
                          ranges: retained.current,
                        },
                )
              }
            />
            {mode === "inherit"
              ? "Use campaign schedule"
              : mode === "round_the_clock"
                ? "Round the Clock"
                : "Custom time ranges"}
          </label>
        ))}
      </div>
      {value.mode === "round_the_clock" && (
        <p>
          Ads can run at any time, subject to your budget and campaign status.
        </p>
      )}
      {value.mode === "inherit" && campaign && (
        <p>Campaign schedule: {scheduleText(campaign)}</p>
      )}
      {value.mode === "custom" && (
        <>
          {value.ranges.map((range, index) => (
            <div className="cf-schedule-range" key={index}>
              {(["startMinute", "endMinute"] as const).map((field, i) => (
                <label key={field}>
                  {i ? "End time" : "Start time"}
                  <input
                    type="time"
                    step={60}
                    value={time(range[field])}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    onChange={(event) => {
                      const parts = event.target.value.split(":").map(Number);
                      const minute =
                        parts.length === 2 ? parts[0] * 60 + parts[1] : NaN;
                      onChange({
                        ...value,
                        ranges: value.ranges.map((r, j) =>
                          j === index ? { ...r, [field]: minute } : r,
                        ),
                      });
                    }}
                  />
                </label>
              ))}
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  onChange({
                    ...value,
                    ranges: value.ranges.filter((_, i) => i !== index),
                  })
                }
                aria-label={`Remove time range ${index + 1}`}
              >
                Remove
              </Button>
              {range.endMinute < range.startMinute && (
                <span>Ends next day</span>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            disabled={value.ranges.length >= 10}
            onClick={() =>
              onChange({
                ...value,
                ranges: [
                  ...value.ranges,
                  { startMinute: 540, endMinute: 1020 },
                ],
              })
            }
          >
            Add time range
          </Button>
        </>
      )}
      {error && (
        <p role="alert" id={`${id}-error`}>
          {error}
        </p>
      )}
    </fieldset>
  );
}
