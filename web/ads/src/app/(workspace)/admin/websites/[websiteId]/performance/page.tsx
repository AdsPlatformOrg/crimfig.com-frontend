import { AdminPerformanceView } from '@/components/console/AdminPerformanceView';
export default async function Page({params}:{params:Promise<{websiteId:string}>}) { const p=await params; return <AdminPerformanceView kind="website" id={p.websiteId}/>; }
