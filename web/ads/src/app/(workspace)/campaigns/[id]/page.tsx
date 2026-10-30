'use client';
import {useParams} from 'next/navigation';
import {CampaignPage} from '../../../../components/console/CampaignPage';
export default function CampaignDetailsPage(){const {id}=useParams<{id:string}>();return <CampaignPage id={id}/>;}
