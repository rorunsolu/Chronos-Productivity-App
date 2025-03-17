import { parseISO, format } from 'date-fns';
import { DatePicker } from '@atlaskit/datetime-picker';

interface DateTimePickerCompoProps {
	value?: Date | null;
	onChange: (date: Date | null) => void;
}

const DateTimePickerCompo = ({ value, onChange }: DateTimePickerCompoProps) => {
	return (
		<>
			<DatePicker
				dateFormat="YYYY-MM-DD"
				placeholder="2021-06-10"
				parseInputValue={ (date: string) => parseISO(date) }
				id="datepicker-format"
				clearControlLabel="Clear due date"
				shouldShowCalendarButton
				inputLabelId="dueDate"
				openCalendarLabel="open calendar"
				value={ value ? format(value, 'yyyy-MM-dd') : '' }
				onChange={ (dateString) => {
					onChange(dateString ? parseISO(dateString) : null);
				} }
			/>
		</>
	)
}

export default DateTimePickerCompo
