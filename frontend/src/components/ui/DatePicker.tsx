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

export function DatePicker({ value, onChange, label }: DatePickerProps) {
    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let month = parseInt(e.target.value)

        if (isNaN(month)) {
            onChange({
                month: 0,
                year: value?.year || 0
            })
            return
        }

        if (month > 12) month = 12
        if (month < 0) month = 0

        onChange({
            month,
            year: value?.year || 0
        })
    }

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const year = parseInt(e.target.value)
        onChange({
            month: value?.month || 0,
            year: isNaN(year) ? 0 : year
        })
    }

    return (
        <div className="space-y-1.5 flex-1">
            {label && <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{label}</label>}
            <div className="flex gap-2">
                <div className="w-16">
                    <Input
                        type="number"
                        placeholder="MM"
                        value={value?.month || ""}
                        onChange={handleMonthChange}
                        min={1}
                        max={12}
                        className="tabular-nums text-center px-1"
                    />
                </div>
                <div className="flex-1">
                    <Input
                        type="number"
                        placeholder="YYYY"
                        value={value?.year || ""}
                        onChange={handleYearChange}
                        className="tabular-nums text-center"
                    />
                </div>
            </div>
        </div>
    )
}
