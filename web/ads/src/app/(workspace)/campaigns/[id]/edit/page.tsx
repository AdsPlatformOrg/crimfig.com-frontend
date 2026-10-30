'use client';
import {useParams} from 'next/navigation';
import {CampaignPage} from '../../../../../components/console/CampaignPage';
export default function CampaignEditPage(){const {id}=useParams<{id:string}>();return <CampaignPage id={id} edit/>;}
