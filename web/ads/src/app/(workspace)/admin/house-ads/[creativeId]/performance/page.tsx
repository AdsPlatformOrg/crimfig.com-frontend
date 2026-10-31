import { AdminPerformanceView } from '@/components/console/AdminPerformanceView';
export default async function Page({params}:{params:Promise<{creativeId:string}>}) { const p=await params; return <AdminPerformanceView kind="creative" id={p.creativeId}/>; }
