import  { useEffect, useState } from 'react'
import BasicTableOne from '../../components/tables/BasicTables/BasicTableOne'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../features/store'
import { fetchAllCustomers } from '../../features/customer/customerApi'
import { PencilIcon, TrashBinIcon } from '../../icons'
import { useSearchParams } from 'react-router'



const CustomerList = () => {
  const dispatch=useDispatch<AppDispatch>();
  const {customers,loading}=useSelector((state:RootState)=>state.customers)
  const [searchParams,] = useSearchParams();
  const [filteredData, setFilteredData] = useState<any[]>([]);
  useEffect(() => {
    dispatch(fetchAllCustomers())
  }, [])

  useEffect(() => {
    const q = searchParams.get('q');
    console.log(q);
  
    if (!q) {
      setFilteredData(customers);
    } else {
      setFilteredData(customers.filter(item => item.name.toLowerCase().includes(q?.toLowerCase() || '')));
    }
  }, [searchParams, customers]);

  if(loading) return <>Loading</>
  
  return (
    <div>
        <div className='font-medium text-lg mb-3'>Customer List</div>
        <BasicTableOne actionList={[<PencilIcon/>, <TrashBinIcon/>]} tableData={filteredData} tableHeadings={[{title:"Mobile",key:"mobile"},{title:"Name",key:"name"},{title:"Action",key:null}]} /></div>
  )
}

export default CustomerList