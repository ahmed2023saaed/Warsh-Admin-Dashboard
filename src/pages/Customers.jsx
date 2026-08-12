import { customerFilters, filters, customerColumns } from '../utils/CustomerFilters'
import useAppTranslation from "../hooks/useAppTranslation";
import { Search } from 'lucide-react'
import FilterButton from '../components/UI/FilterButton'
import { useMemo, useState } from 'react';
import mockCustomers from '../Data/customers.json'
import DataTable from '../components/UI/DataTable';


function Customers() {

  const { t } = useAppTranslation('customers');
  const [isActive, setIsActive] = useState('all');
  const [customers, setCustomers] = useState(mockCustomers)
  const [search, setSearch] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSuspendCustomer = (customer) => {
    console.log('Suspend customer:', customer);

    // Later, replace this with your context or API request:
    // suspendCustomer(customer.id);
  };


  const FilterCount = {
    all: customers.length,
    // active: customers.filter( customer => customer.status === 'active').length,
    // suspended: customers.filter( customer => customer.status === 'suspended').length,
    ...Object.fromEntries(
      ['active', 'suspended', 'new'].map((filter) => [
        filter,
        customers.filter((c) => c.status === filter).length
      ])
    )
  }

  const filtered = useMemo(() => 
    filters(customers, { search, tap:isActive })
  , [isActive, search])

  console.log(filtered)

  const perPage = 8
  const totalPages = Math.max(1,Math.ceil(filtered.length / perPage))
  const currentPageSafe = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((currentPageSafe - 1) * perPage,
    currentPageSafe * perPage)


  return (
    <div className='m-6 space-y-8'>


      {/* Header Buttons */}

      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>

        <div className='space-x-2 space-y-2'>
          {customerFilters.map((item) => (

            <FilterButton
              count={FilterCount[item.key]}
              active={isActive === item.key}
              onClick={() => setIsActive(item.key)}
              key={item.key}
            >
              {t(item.key)}
            </FilterButton>
          ))}
        </div>

        <div className='relative '>
          <Search className=' absolute left-2 text-gray-500 top-1/2 -translate-y-1/2 ' size={18} />
          <input
            type="search"
            className='h-full bg-white px-8 py-2 border border-gray-300 rounded-xl '
            placeholder={t('placeholder')}
            value={search}
            onChange={(e) => { setSearch(e.target.value) }}

          />

        </div>

      </div>


    {/* columns,
    data,
    emptyMessage,
    minWidth,
    cellClassName */}
    
      <DataTable
        columns={customerColumns}
        data={paginated}
        emptyMessage="No customers found."
        minWidth="1100px"
      />



    </div>
  );
}

export default Customers;
