import  { useEffect } from 'react'
import BasicTableOne from '../../components/tables/BasicTables/BasicTableOne'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../features/store'
import { fetchAllCustomers } from '../../features/customer/customerApi'
import { PencilIcon, TrashBinIcon } from '../../icons'



const CustomerList = () => {
  const dispatch=useDispatch<AppDispatch>();
  const {customers,loading}=useSelector((state:RootState)=>state.customers)
  useEffect(() => {
    dispatch(fetchAllCustomers())
  }, [])

  if(loading) return <>Loading</>
  
  return (
    <div>
        <div className='font-medium text-lg mb-3'>Customer List</div>
        <BasicTableOne actionList={[<PencilIcon/>, <TrashBinIcon/>]} tableData={customers} tableHeadings={[{title:"Mobile",key:"mobile"},{title:"Name",key:"name"},{title:"Action",key:null}]} /></div>
  )
}

export default CustomerList