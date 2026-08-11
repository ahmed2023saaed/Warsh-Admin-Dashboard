import {customerFilters} from '../utils/CustomerFilters'
import useAppTranslation from "../hooks/useAppTranslation";
import {Search} from 'lucide-react'


function Customers() {

  const { t } = useAppTranslation();


  return (
    <div className='m-6'>
      

       {/* Header Buttons */}

      <div className='flex align-center justify-between'>

        <div className='space-x-2 '>
          {customerFilters.map((item)=>(
            <button className='p-2 bg-white/90 shadow-sm rounded-lg border border-gray-200'>
              {t(`customers.${item.key}`)}
              <span className='ms-2 p-1 text-center text-gray-600 rounded-full bg-gray-100'> 23</span>
            </button>
          ))}
        </div>

        <div className='relative flex '>
          <Search className=' absolute left-2 text-gray-500 top-1/2 -translate-y-1/2 ' size={18} />
          <input type="search" className='h-full bg-white px-8 py-2 border border-gray-300 rounded-xl '  placeholder={`${t('customers.placeholder')}`} />

        </div>

      </div>


      
    </div>
  );
}

export default Customers;
