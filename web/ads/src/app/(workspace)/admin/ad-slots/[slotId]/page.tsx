import { AdminPerformanceView } from '@/components/console/AdminPerformanceView';
export default async function Page({params}:{params:Promise<{slotId:string}>}) { const p=await params; return <AdminPerformanceView kind="slot" id={p.slotId}/>; }
