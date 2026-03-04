import * as React from "react"
import { Input } from "./Input"

interface DateValue {
    month: number
    year: number
}

interface DatePickerProps {
    value: DateValue | null
    onChange: (value: DateValue) => void
    label?: string
}

export function DatePicker({ value, onChange }: DatePickerProps) {
    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let month = parseInt(e.target.value) || 0

        if (month > 12) month = 12
        if (month < 0) month = 0

        onChange({
            month,
            year: value?.year || new Date().getFullYear()
        })
    }

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const year = parseInt(e.target.value) || 0
        onChange({
            month: value?.month || 0,
            year
        })
    }

    return (
        <div className="flex gap-2">
            <div className="w-20">
                <Input
                    type="number"
                    placeholder="MM"
                    value={value?.month || ""}
                    onChange={handleMonthChange}
                    max={12}
                    className="tabular-nums"
                />
            </div>
            <div className="flex-1">
                <Input
                    type="number"
                    placeholder="YYYY"
                    value={value?.year || ""}
                    onChange={handleYearChange}
                    className="tabular-nums"
                />
            </div>
        </div>
    )
}
