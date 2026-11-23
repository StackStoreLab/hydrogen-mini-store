import {Form, useSubmit} from 'react-router';
import {SORT_OPTIONS, type SortValue} from '~/lib/sort';

/** Sort dropdown that updates ?sort= and keeps working without JavaScript. */
export function SortSelect({value}: {value: SortValue}) {
  const submit = useSubmit();

  return (
    <Form method="get" className="sort-select" preventScrollReset>
      <label htmlFor="sort">Sort by</label>
      <select
        id="sort"
        name="sort"
        defaultValue={value}
        onChange={(event) =>
          void submit(event.currentTarget.form, {preventScrollReset: true})
        }
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit">Apply</button>
      </noscript>
    </Form>
  );
}
