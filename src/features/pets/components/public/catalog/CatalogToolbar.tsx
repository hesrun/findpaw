import FiltersDrawer from './FiltersDrawer';
import SearchField from './SearchField';
import SortSelect from './SortSelect';

export default function CatalogToolbar() {
    return (
        <div className="flex flex-wrap items-end gap-3 mb-4">
            <FiltersDrawer />
            <SearchField />
            <SortSelect />
        </div>
    );
}
