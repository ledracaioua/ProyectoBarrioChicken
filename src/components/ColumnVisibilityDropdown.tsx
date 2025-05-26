// components/ColumnVisibilityDropdown.tsx
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Settings } from 'lucide-react';

type ColumnVisibilityDropdownProps = {
  visibleColumns: Record<string, boolean>;
  setVisibleColumns: (columns: Record<string, boolean>) => void;
};

const ColumnVisibilityDropdown = ({
  visibleColumns,
  setVisibleColumns,
}: ColumnVisibilityDropdownProps) => {
  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex justify-center items-center px-3 py-2 bg-rose-200 text-rose-800 text-sm font-medium rounded-lg hover:bg-rose-300 focus:outline-none shadow">
        <Settings className="w-4 h-4 mr-2" />
        Columnas
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-lg focus:outline-none">
          <div className="p-2">
            {Object.entries(visibleColumns).map(([key, value]) => (
              <Menu.Item key={key}>
                {() => (
                  <label className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => toggleColumn(key)}
                      className="form-checkbox text-rose-600 rounded"
                    />
                    <span className="capitalize">{key === 'sku' ? 'SKU' : key}</span>
                  </label>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ColumnVisibilityDropdown;
