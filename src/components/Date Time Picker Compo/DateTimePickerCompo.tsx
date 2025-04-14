// import { parseISO, format } from 'date-fns';
//import { DatePicker } from '@atlaskit/datetime-picker';
// import { parseISO } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateTimePickerCompoProps {
  selected?: Date | null;
  onChange: (date: Date | null) => void;
}

const DateTimePickerCompo = ({
  selected,
  onChange,
}: DateTimePickerCompoProps) => {
  return (
    <>
      <DatePicker
        //showIcon
        // dateFormat="yyyy-MM-dd" // Correct format for react-datepicker
        placeholderText="YYYY-MM-DD" // Correct prop name for placeholder
        // id="datepicker-format"
        selected={selected || null} // Pass Date | null directly
        onChange={(date) => {
          onChange(date); // Pass Date | null directly to the parent
        }}
        // showTimeSelect
        // dateFormat="Pp"
      />
    </>
  );
};

export default DateTimePickerCompo;
