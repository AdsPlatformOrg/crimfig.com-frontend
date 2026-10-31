import { AdminPerformanceView } from '@/components/console/AdminPerformanceView';
export default async function Page({params}:{params:Promise<{promoterId:string}>}) { const p=await params; return <AdminPerformanceView kind="promoter" id={p.promoterId}/>; }
