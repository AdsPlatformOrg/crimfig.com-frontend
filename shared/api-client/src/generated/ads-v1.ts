export interface paths {
    "/api/v1/admin/ads/auction-decisions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AdsOperations_listAuctionDecisions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/auction-decisions/{requestId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AdsOperations_getAuctionDecision"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/campaigns/{id}/change-audit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Moderation_changeAudit"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/campaigns/{id}/decision": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Moderation_reviewCampaign"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/campaigns/{id}/emergency-override": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Moderation_emergencyOverride"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/campaigns/{id}/manager-approval": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Moderation_managerApprovalCampaign"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/campaigns/{id}/primary-review": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Moderation_primaryReviewCampaign"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/campaigns/{id}/review-requests/{requestId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Moderation_reviewReceipt"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/campaigns/{id}/submission": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Moderation_submissionDetail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/creatives/{id}/decision": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Moderation_reviewCreative"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/creatives/{id}/manager-approval": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Moderation_managerApprovalCreative"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/creatives/{id}/primary-review": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Moderation_primaryReviewCreative"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/items/{targetType}/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Moderation_itemDetail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/items/{targetType}/{id}/claim": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Moderation_getClaim"];
        put?: never;
        post: operations["Moderation_acquireClaim"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/items/{targetType}/{id}/claim/release": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Moderation_releaseClaim"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/items/{targetType}/{id}/claim/renew": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Moderation_renewClaim"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/items/{targetType}/{id}/claim/takeover": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Moderation_takeoverClaim"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/operations-summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Moderation_operationsSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/promoters/{id}/suspend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Moderation_suspendPromoter"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/queue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Moderation_getQueue"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/stacks/{id}/manager-approval": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Moderation_managerApprovalStack"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/moderation/stacks/{id}/primary-review": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Moderation_primaryReviewStack"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/slots/{id}/check-installation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AdsOperations_adminCheckSlotInstallation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/slots/{id}/lifecycle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AdsOperations_adminUpdateSlotLifecycle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/websites": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AdsOperations_adminListWebsites"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/websites/{websiteId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AdsOperations_adminGetWebsite"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/websites/{websiteId}/policy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AdsOperations_reviewWebsitePolicy"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/websites/{websiteId}/reinstate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AdsOperations_reinstateWebsite"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ads/websites/{websiteId}/suspend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AdsOperations_suspendWebsite"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/adstation/admin/auction-decisions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AdsOperations_listAuctionDecisions_legacy"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/adstation/admin/auction-decisions/{requestId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AdsOperations_getAuctionDecision_legacy"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/adstation/admin/slots/{id}/check-installation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AdsOperations_adminCheckSlotInstallation_legacy"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/adstation/admin/slots/{id}/lifecycle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AdsOperations_adminUpdateSlotLifecycle_legacy"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/adstation/admin/websites": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AdsOperations_adminListWebsites_legacy"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/adstation/admin/websites/{websiteId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AdsOperations_adminGetWebsite_legacy"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/adstation/admin/websites/{websiteId}/policy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AdsOperations_reviewWebsitePolicy_legacy"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/adstation/admin/websites/{websiteId}/reinstate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AdsOperations_reinstateWebsite_legacy"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/adstation/admin/websites/{websiteId}/suspend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AdsOperations_suspendWebsite_legacy"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Campaigns_getAdvertiserCampaigns"];
        put?: never;
        post: operations["Campaigns_createCampaign"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/admin/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Campaigns_staffCampaignPage"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/admin/{id}/delivery-readiness": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Campaigns_staffDeliveryReadiness"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/catalog": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Campaigns_getCatalog"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/creation-capabilities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Campaigns_getCreationCapabilities"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/creation-request/{requestId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Campaigns_findCreationRequest"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/creatives/{id}/replace": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["Campaigns_replaceCreative"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/page": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Campaigns_campaignPage"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Campaigns_getCampaignDetails"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["Campaigns_saveCampaign"];
        trace?: never;
    };
    "/api/v1/campaigns/{id}/ad-stacks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Campaigns_createStack"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/{id}/ad-stacks/{stackId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["Campaigns_deleteStack"];
        options?: never;
        head?: never;
        patch: operations["Campaigns_updateStack"];
        trace?: never;
    };
    "/api/v1/campaigns/{id}/begin-edit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Campaigns_beginEdit"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/{id}/creatives": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Campaigns_addCreative"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/{id}/creatives/{creativeId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["Campaigns_deleteCreative"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/{id}/delivery-readiness": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Campaigns_deliveryReadiness"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/{id}/mutations/{requestId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Campaigns_mutationResult"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["Campaigns_updateStatus"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/campaigns/{id}/submit-review": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Campaigns_submitForReview"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/publisher/setup-checks/{checkId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PublisherInventory_getSetupCheck"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/publisher/slots": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["PublisherInventory_createSlot"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/publisher/slots/{slotId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["PublisherInventory_updateSlot"];
        trace?: never;
    };
    "/api/v1/publisher/slots/{slotId}/check-installation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["PublisherInventory_checkSlotInstallation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/publisher/slots/{slotId}/diagnostics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PublisherInventory_getSlotDiagnostics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/publisher/slots/{slotId}/embed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PublisherInventory_getSlotEmbed"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/publisher/websites/{websiteId}/setup-checks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["PublisherInventory_createSetupCheck"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/publisher/websites/{websiteId}/slots": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["PublisherInventory_getSlots"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/uploads/assets/{assetId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Uploads_readyAsset"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/uploads/direct": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Uploads_uploadDirect"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/uploads/media/{storageKey}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Uploads_getMedia"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/uploads/prepared": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Uploads_uploadPrepared"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/uploads/presign": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Uploads_presign"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/uploads/private-media/{storageKey}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Uploads_previewMedia"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/uploads/review-media/{storageKey}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Uploads_reviewMedia"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/uploads/settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Uploads_getSettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/uploads/{assetId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["Uploads_deleteAsset"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/uploads/{assetId}/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Uploads_complete"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AddCreativeDto: {
            /** @enum {string|null} */
            adFormat?: "banner" | "card" | "video" | "interstitial" | null;
            /** Format: uuid */
            adStackId?: string | null;
            /** @enum {string|null} */
            adType?: "text" | "image" | "video" | null;
            bodyText?: string | null;
            ctaText?: string | null;
            destinationUrl: string;
            expectedRevision: number;
            headline?: string | null;
            imageUrl?: string | null;
            /** Format: uuid */
            mediaAssetId?: string | null;
            /** @enum {string|null} */
            mediaFormat?: "image" | "gif" | "video" | null;
            /** Format: uuid */
            requestId: string;
            videoUrl?: string | null;
        };
        AdsApiError: {
            code: string;
            fieldErrors?: {
                [key: string]: string[];
            };
            message: string;
            path?: string;
            requestId: string;
            /** @enum {string} */
            status: "error";
            statusCode: number;
            timestamp?: string;
        };
        AdsOperations_adminCheckSlotInstallationResponse: {
            data: {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        AdsOperations_adminGetWebsiteResponse: {
            data: {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        AdsOperations_adminListWebsitesResponse: {
            data: {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        AdsOperations_adminUpdateSlotLifecycleResponse: {
            data: {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        AdsOperations_getAuctionDecisionResponse: {
            data: (({
                pricingBreakdown?: ({
                    batchStatus: string | null;
                    bidUsdCents: number | null;
                    /** @enum {string|null} */
                    billingUnit: "eligible click" | "eligible viewable impression" | null;
                    claimId: string | null;
                    claimPriceNanos: string | null;
                    /** @enum {string|null} */
                    clearingBasis: "single_group_reserve" | "runner_up_with_floor" | null;
                    pctrBasisPoints: string | null;
                    publisherClearanceStatus: string | null;
                    publisherEarningsCents: string | null;
                    reservationId: string;
                    reservationSettledAt: string | null;
                    reservationState: string;
                    reservedNanos: string;
                    secondPriceMicros: string | null;
                    settledDebitCents: string | null;
                    winnerScoreMicros: string | null;
                } & {
                    [key: string]: unknown;
                }) | null;
            } & {
                [key: string]: unknown;
            }) | null) | null;
            /** @enum {string} */
            status: "success";
        };
        AdsOperations_listAuctionDecisionsResponse: {
            data: {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        AdsOperations_reinstateWebsiteResponse: {
            data: {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        AdsOperations_reviewWebsitePolicyResponse: {
            data: {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        AdsOperations_suspendWebsiteResponse: {
            data: {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        BeginEditDto: {
            expectedRevision: number;
            /** Format: uuid */
            requestId: string;
            /** Format: uuid */
            submissionId?: string | null;
        };
        Campaigns_addCreativeResponse: {
            data: {
                /** @enum {string} */
                adFormat?: "banner" | "card" | "video" | "interstitial";
                adStackId?: string | null;
                /** @enum {string} */
                adType?: "text" | "image" | "video";
                bodyText?: string | null;
                campaignId: string;
                ctaText?: string | null;
                destinationUrl: string;
                headline?: string | null;
                id: string;
                imageSpecs?: ({
                    bytes?: number;
                    height?: number | null;
                    mimeType?: string;
                    preparation?: {
                        [key: string]: unknown;
                    } | null;
                    renditions?: {
                        [key: string]: unknown;
                    }[];
                    sha256?: string | null;
                    width?: number | null;
                } & {
                    [key: string]: unknown;
                }) | null;
                imageUrl?: string | null;
                mediaAssetId?: string | null;
                /** @enum {string|null} */
                mediaFormat?: "image" | "gif" | "video" | null;
                posterUrl?: string | null;
                rejectionReason?: string | null;
                /** @enum {string} */
                reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                status?: string;
                videoUrl?: string | null;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Campaigns_beginEditResponse: {
            data: {
                adStacks?: ({
                    campaignId: string;
                    creatives?: ({
                        /** @enum {string} */
                        adFormat?: "banner" | "card" | "video" | "interstitial";
                        adStackId?: string | null;
                        /** @enum {string} */
                        adType?: "text" | "image" | "video";
                        bodyText?: string | null;
                        campaignId: string;
                        ctaText?: string | null;
                        destinationUrl: string;
                        headline?: string | null;
                        id: string;
                        imageSpecs?: ({
                            bytes?: number;
                            height?: number | null;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number | null;
                        } & {
                            [key: string]: unknown;
                        }) | null;
                        imageUrl?: string | null;
                        mediaAssetId?: string | null;
                        /** @enum {string|null} */
                        mediaFormat?: "image" | "gif" | "video" | null;
                        posterUrl?: string | null;
                        rejectionReason?: string | null;
                        /** @enum {string} */
                        reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                        status?: string;
                        videoUrl?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    effectiveSettings?: {
                        /** @enum {string} */
                        geoMode?: "inherit" | "global" | "targeted";
                        locations?: {
                            [key: string]: unknown;
                        }[];
                        schedule?: ({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        });
                        targetDevices?: string[];
                        targetHours?: number[];
                    } & {
                        [key: string]: unknown;
                    };
                    geoMode?: string;
                    id: string;
                    name: string;
                    position?: number;
                    schedule?: (({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    })) | null;
                    settings?: {
                        /** @enum {string} */
                        geoMode?: "inherit" | "global" | "targeted";
                        locations?: {
                            [key: string]: unknown;
                        }[];
                        schedule?: ({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        });
                        targetDevices?: string[];
                        targetHours?: number[];
                    } & {
                        [key: string]: unknown;
                    };
                    targetDevices?: string | null;
                    targetHours?: string | null;
                } & {
                    [key: string]: unknown;
                })[];
                advertiserId?: string;
                approvedRevision?: number | null;
                approvedSubmissionId?: string | null;
                budgetUsd?: number;
                budgetUsdCents?: number;
                capabilities?: {
                    blocker: string | null;
                    canActivate: boolean;
                    canBeginEdit: boolean;
                    canEdit: boolean;
                    canPause: boolean;
                    canSubmit: boolean;
                    canTrash: boolean;
                } & {
                    [key: string]: unknown;
                };
                category?: string | null;
                channels?: string | null;
                clicksCount?: number;
                contentRevision: number;
                costPerClickUsdCents?: number;
                costPerImpressionUsdCents?: number;
                createdAt?: string;
                creatives?: ({
                    /** @enum {string} */
                    adFormat?: "banner" | "card" | "video" | "interstitial";
                    adStackId?: string | null;
                    /** @enum {string} */
                    adType?: "text" | "image" | "video";
                    bodyText?: string | null;
                    campaignId: string;
                    ctaText?: string | null;
                    destinationUrl: string;
                    headline?: string | null;
                    id: string;
                    imageSpecs?: ({
                        bytes?: number;
                        height?: number | null;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number | null;
                    } & {
                        [key: string]: unknown;
                    }) | null;
                    imageUrl?: string | null;
                    mediaAssetId?: string | null;
                    /** @enum {string|null} */
                    mediaFormat?: "image" | "gif" | "video" | null;
                    posterUrl?: string | null;
                    rejectionReason?: string | null;
                    /** @enum {string} */
                    reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                    status?: string;
                    videoUrl?: string | null;
                } & {
                    [key: string]: unknown;
                })[];
                currentSubmissionId?: string | null;
                dailyBudgetUsd?: number | null;
                dailyBudgetUsdCents?: number | null;
                defaultStackId?: string;
                description?: string | null;
                endsAt?: string | null;
                /** @enum {string} */
                format?: "banner" | "card" | "video" | "interstitial";
                formats?: ("banner" | "card" | "video" | "interstitial")[];
                frequencyCapPerDay?: number;
                geoLocations?: {
                    [key: string]: unknown;
                }[];
                geoMode?: string;
                hourlyPacingUsdCents?: number | null;
                hoversCount?: number;
                id: string;
                impressionsCount?: number;
                /** @enum {string} */
                moderationStatus?: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                pricingModel?: string;
                pricingVersion?: number;
                rejectionReason?: string | null;
                remainingBudgetUsd?: number;
                remainingBudgetUsdCents?: number;
                schedule?: (({
                    /** @enum {string} */
                    mode: "inherit";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                }) | ({
                    /** @enum {string} */
                    mode: "round_the_clock" | "custom";
                    ranges: ({
                        endMinute: number;
                        startMinute: number;
                    } & {
                        [key: string]: unknown;
                    })[];
                    /** @enum {string} */
                    timezone: "Africa/Lagos";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                })) | null;
                spentUsd?: number;
                startsAt?: string | null;
                /** @enum {string} */
                status?: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                submissionIntentId?: string | null;
                submissionRequestId?: string | null;
                submissionState?: string | null;
                submittedAt?: string | null;
                targetCountries?: string | null;
                targetDevices?: (string | string[]) | null;
                targetHours?: (string | number[]) | null;
                targetStates?: string | null;
                title: string;
                touchesCount?: number;
                updatedAt?: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Campaigns_campaignPageResponse: {
            data: {
                counts: {
                    [key: string]: number;
                };
                items: ({
                    adStacks?: ({
                        campaignId: string;
                        creatives?: ({
                            /** @enum {string} */
                            adFormat?: "banner" | "card" | "video" | "interstitial";
                            adStackId?: string | null;
                            /** @enum {string} */
                            adType?: "text" | "image" | "video";
                            bodyText?: string | null;
                            campaignId: string;
                            ctaText?: string | null;
                            destinationUrl: string;
                            headline?: string | null;
                            id: string;
                            imageSpecs?: ({
                                bytes?: number;
                                height?: number | null;
                                mimeType?: string;
                                preparation?: {
                                    [key: string]: unknown;
                                } | null;
                                renditions?: {
                                    [key: string]: unknown;
                                }[];
                                sha256?: string | null;
                                width?: number | null;
                            } & {
                                [key: string]: unknown;
                            }) | null;
                            imageUrl?: string | null;
                            mediaAssetId?: string | null;
                            /** @enum {string|null} */
                            mediaFormat?: "image" | "gif" | "video" | null;
                            posterUrl?: string | null;
                            rejectionReason?: string | null;
                            /** @enum {string} */
                            reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                            status?: string;
                            videoUrl?: string | null;
                        } & {
                            [key: string]: unknown;
                        })[];
                        effectiveSettings?: {
                            /** @enum {string} */
                            geoMode?: "inherit" | "global" | "targeted";
                            locations?: {
                                [key: string]: unknown;
                            }[];
                            schedule?: ({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            });
                            targetDevices?: string[];
                            targetHours?: number[];
                        } & {
                            [key: string]: unknown;
                        };
                        geoMode?: string;
                        id: string;
                        name: string;
                        position?: number;
                        schedule?: (({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        })) | null;
                        settings?: {
                            /** @enum {string} */
                            geoMode?: "inherit" | "global" | "targeted";
                            locations?: {
                                [key: string]: unknown;
                            }[];
                            schedule?: ({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            });
                            targetDevices?: string[];
                            targetHours?: number[];
                        } & {
                            [key: string]: unknown;
                        };
                        targetDevices?: string | null;
                        targetHours?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    advertiserId?: string;
                    approvedRevision?: number | null;
                    approvedSubmissionId?: string | null;
                    budgetUsd?: number;
                    budgetUsdCents: number;
                    capabilities?: {
                        blocker: string | null;
                        canActivate: boolean;
                        canBeginEdit: boolean;
                        canEdit: boolean;
                        canPause: boolean;
                        canSubmit: boolean;
                        canTrash: boolean;
                    } & {
                        [key: string]: unknown;
                    };
                    category?: string | null;
                    channels?: string | null;
                    clicksCount?: number;
                    contentRevision?: number;
                    costPerClickUsdCents?: number;
                    costPerImpressionUsdCents?: number;
                    createdAt?: string;
                    creatives?: ({
                        /** @enum {string} */
                        adFormat?: "banner" | "card" | "video" | "interstitial";
                        adStackId?: string | null;
                        /** @enum {string} */
                        adType?: "text" | "image" | "video";
                        bodyText?: string | null;
                        campaignId: string;
                        ctaText?: string | null;
                        destinationUrl: string;
                        headline?: string | null;
                        id: string;
                        imageSpecs?: ({
                            bytes?: number;
                            height?: number | null;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number | null;
                        } & {
                            [key: string]: unknown;
                        }) | null;
                        imageUrl?: string | null;
                        mediaAssetId?: string | null;
                        /** @enum {string|null} */
                        mediaFormat?: "image" | "gif" | "video" | null;
                        posterUrl?: string | null;
                        rejectionReason?: string | null;
                        /** @enum {string} */
                        reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                        status?: string;
                        videoUrl?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    currentSubmissionId?: string | null;
                    dailyBudgetUsd?: number | null;
                    dailyBudgetUsdCents?: number | null;
                    defaultStackId?: string;
                    description?: string | null;
                    endsAt?: string | null;
                    /** @enum {string} */
                    format: "banner" | "card" | "video" | "interstitial";
                    formats?: ("banner" | "card" | "video" | "interstitial")[];
                    frequencyCapPerDay?: number;
                    geoLocations?: {
                        [key: string]: unknown;
                    }[];
                    geoMode?: string;
                    hourlyPacingUsdCents?: number | null;
                    hoversCount?: number;
                    id: string;
                    impressionsCount?: number;
                    /** @enum {string} */
                    moderationStatus: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                    pricingModel?: string;
                    pricingVersion?: number;
                    rejectionReason?: string | null;
                    remainingBudgetUsd?: number;
                    remainingBudgetUsdCents: number;
                    schedule?: (({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    })) | null;
                    spentUsd?: number;
                    startsAt?: string | null;
                    /** @enum {string} */
                    status: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                    submissionIntentId?: string | null;
                    submissionRequestId?: string | null;
                    submissionState?: string | null;
                    submittedAt?: string | null;
                    targetCountries?: string | null;
                    targetDevices?: (string | string[]) | null;
                    targetHours?: (string | number[]) | null;
                    targetStates?: string | null;
                    title: string;
                    touchesCount?: number;
                    updatedAt?: string;
                } & {
                    [key: string]: unknown;
                })[];
                page: number;
                pageSize: number;
                total: number;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Campaigns_createCampaignResponse: {
            data: {
                adStacks?: ({
                    campaignId: string;
                    creatives?: ({
                        /** @enum {string} */
                        adFormat?: "banner" | "card" | "video" | "interstitial";
                        adStackId?: string | null;
                        /** @enum {string} */
                        adType?: "text" | "image" | "video";
                        bodyText?: string | null;
                        campaignId: string;
                        ctaText?: string | null;
                        destinationUrl: string;
                        headline?: string | null;
                        id: string;
                        imageSpecs?: ({
                            bytes?: number;
                            height?: number | null;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number | null;
                        } & {
                            [key: string]: unknown;
                        }) | null;
                        imageUrl?: string | null;
                        mediaAssetId?: string | null;
                        /** @enum {string|null} */
                        mediaFormat?: "image" | "gif" | "video" | null;
                        posterUrl?: string | null;
                        rejectionReason?: string | null;
                        /** @enum {string} */
                        reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                        status?: string;
                        videoUrl?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    effectiveSettings?: {
                        /** @enum {string} */
                        geoMode?: "inherit" | "global" | "targeted";
                        locations?: {
                            [key: string]: unknown;
                        }[];
                        schedule?: ({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        });
                        targetDevices?: string[];
                        targetHours?: number[];
                    } & {
                        [key: string]: unknown;
                    };
                    geoMode?: string;
                    id: string;
                    name: string;
                    position?: number;
                    schedule?: (({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    })) | null;
                    settings?: {
                        /** @enum {string} */
                        geoMode?: "inherit" | "global" | "targeted";
                        locations?: {
                            [key: string]: unknown;
                        }[];
                        schedule?: ({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        });
                        targetDevices?: string[];
                        targetHours?: number[];
                    } & {
                        [key: string]: unknown;
                    };
                    targetDevices?: string | null;
                    targetHours?: string | null;
                } & {
                    [key: string]: unknown;
                })[];
                advertiserId?: string;
                approvedRevision?: number | null;
                approvedSubmissionId?: string | null;
                budgetUsd?: number;
                budgetUsdCents: number;
                capabilities?: {
                    blocker: string | null;
                    canActivate: boolean;
                    canBeginEdit: boolean;
                    canEdit: boolean;
                    canPause: boolean;
                    canSubmit: boolean;
                    canTrash: boolean;
                } & {
                    [key: string]: unknown;
                };
                category?: string | null;
                channels?: string | null;
                clicksCount?: number;
                contentRevision?: number;
                costPerClickUsdCents?: number;
                costPerImpressionUsdCents?: number;
                createdAt?: string;
                creatives?: ({
                    /** @enum {string} */
                    adFormat?: "banner" | "card" | "video" | "interstitial";
                    adStackId?: string | null;
                    /** @enum {string} */
                    adType?: "text" | "image" | "video";
                    bodyText?: string | null;
                    campaignId: string;
                    ctaText?: string | null;
                    destinationUrl: string;
                    headline?: string | null;
                    id: string;
                    imageSpecs?: ({
                        bytes?: number;
                        height?: number | null;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number | null;
                    } & {
                        [key: string]: unknown;
                    }) | null;
                    imageUrl?: string | null;
                    mediaAssetId?: string | null;
                    /** @enum {string|null} */
                    mediaFormat?: "image" | "gif" | "video" | null;
                    posterUrl?: string | null;
                    rejectionReason?: string | null;
                    /** @enum {string} */
                    reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                    status?: string;
                    videoUrl?: string | null;
                } & {
                    [key: string]: unknown;
                })[];
                currentSubmissionId?: string | null;
                dailyBudgetUsd?: number | null;
                dailyBudgetUsdCents?: number | null;
                defaultStackId?: string;
                description?: string | null;
                endsAt?: string | null;
                /** @enum {string} */
                format: "banner" | "card" | "video" | "interstitial";
                formats?: ("banner" | "card" | "video" | "interstitial")[];
                frequencyCapPerDay?: number;
                geoLocations?: {
                    [key: string]: unknown;
                }[];
                geoMode?: string;
                hourlyPacingUsdCents?: number | null;
                hoversCount?: number;
                id: string;
                impressionsCount?: number;
                /** @enum {string} */
                moderationStatus: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                pricingModel?: string;
                pricingVersion?: number;
                rejectionReason?: string | null;
                remainingBudgetUsd?: number;
                remainingBudgetUsdCents: number;
                schedule?: (({
                    /** @enum {string} */
                    mode: "inherit";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                }) | ({
                    /** @enum {string} */
                    mode: "round_the_clock" | "custom";
                    ranges: ({
                        endMinute: number;
                        startMinute: number;
                    } & {
                        [key: string]: unknown;
                    })[];
                    /** @enum {string} */
                    timezone: "Africa/Lagos";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                })) | null;
                spentUsd?: number;
                startsAt?: string | null;
                /** @enum {string} */
                status: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                submissionIntentId?: string | null;
                submissionRequestId?: string | null;
                submissionState?: string | null;
                submittedAt?: string | null;
                targetCountries?: string | null;
                targetDevices?: (string | string[]) | null;
                targetHours?: (string | number[]) | null;
                targetStates?: string | null;
                title: string;
                touchesCount?: number;
                updatedAt?: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Campaigns_createStackResponse: {
            data: {
                campaignId: string;
                creatives?: ({
                    /** @enum {string} */
                    adFormat?: "banner" | "card" | "video" | "interstitial";
                    adStackId?: string | null;
                    /** @enum {string} */
                    adType?: "text" | "image" | "video";
                    bodyText?: string | null;
                    campaignId: string;
                    ctaText?: string | null;
                    destinationUrl: string;
                    headline?: string | null;
                    id: string;
                    imageSpecs?: ({
                        bytes?: number;
                        height?: number | null;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number | null;
                    } & {
                        [key: string]: unknown;
                    }) | null;
                    imageUrl?: string | null;
                    mediaAssetId?: string | null;
                    /** @enum {string|null} */
                    mediaFormat?: "image" | "gif" | "video" | null;
                    posterUrl?: string | null;
                    rejectionReason?: string | null;
                    /** @enum {string} */
                    reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                    status?: string;
                    videoUrl?: string | null;
                } & {
                    [key: string]: unknown;
                })[];
                effectiveSettings?: {
                    /** @enum {string} */
                    geoMode?: "inherit" | "global" | "targeted";
                    locations?: {
                        [key: string]: unknown;
                    }[];
                    schedule?: ({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    });
                    targetDevices?: string[];
                    targetHours?: number[];
                } & {
                    [key: string]: unknown;
                };
                geoMode?: string;
                id: string;
                name: string;
                position?: number;
                schedule?: (({
                    /** @enum {string} */
                    mode: "inherit";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                }) | ({
                    /** @enum {string} */
                    mode: "round_the_clock" | "custom";
                    ranges: ({
                        endMinute: number;
                        startMinute: number;
                    } & {
                        [key: string]: unknown;
                    })[];
                    /** @enum {string} */
                    timezone: "Africa/Lagos";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                })) | null;
                settings?: {
                    /** @enum {string} */
                    geoMode?: "inherit" | "global" | "targeted";
                    locations?: {
                        [key: string]: unknown;
                    }[];
                    schedule?: ({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    });
                    targetDevices?: string[];
                    targetHours?: number[];
                } & {
                    [key: string]: unknown;
                };
                targetDevices?: string | null;
                targetHours?: string | null;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Campaigns_deleteCreativeResponse: {
            data: {
                contentRevision: number;
                creativeId: string;
                deleted: boolean;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Campaigns_deleteStackResponse: {
            data: {
                deleted?: boolean;
                stackId?: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Campaigns_findCreationRequestResponse: {
            data: (({
                adStacks?: ({
                    campaignId: string;
                    creatives?: ({
                        /** @enum {string} */
                        adFormat?: "banner" | "card" | "video" | "interstitial";
                        adStackId?: string | null;
                        /** @enum {string} */
                        adType?: "text" | "image" | "video";
                        bodyText?: string | null;
                        campaignId: string;
                        ctaText?: string | null;
                        destinationUrl: string;
                        headline?: string | null;
                        id: string;
                        imageSpecs?: ({
                            bytes?: number;
                            height?: number | null;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number | null;
                        } & {
                            [key: string]: unknown;
                        }) | null;
                        imageUrl?: string | null;
                        mediaAssetId?: string | null;
                        /** @enum {string|null} */
                        mediaFormat?: "image" | "gif" | "video" | null;
                        posterUrl?: string | null;
                        rejectionReason?: string | null;
                        /** @enum {string} */
                        reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                        status?: string;
                        videoUrl?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    effectiveSettings?: {
                        /** @enum {string} */
                        geoMode?: "inherit" | "global" | "targeted";
                        locations?: {
                            [key: string]: unknown;
                        }[];
                        schedule?: ({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        });
                        targetDevices?: string[];
                        targetHours?: number[];
                    } & {
                        [key: string]: unknown;
                    };
                    geoMode?: string;
                    id: string;
                    name: string;
                    position?: number;
                    schedule?: (({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    })) | null;
                    settings?: {
                        /** @enum {string} */
                        geoMode?: "inherit" | "global" | "targeted";
                        locations?: {
                            [key: string]: unknown;
                        }[];
                        schedule?: ({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        });
                        targetDevices?: string[];
                        targetHours?: number[];
                    } & {
                        [key: string]: unknown;
                    };
                    targetDevices?: string | null;
                    targetHours?: string | null;
                } & {
                    [key: string]: unknown;
                })[];
                advertiserId?: string;
                approvedRevision?: number | null;
                approvedSubmissionId?: string | null;
                budgetUsd?: number;
                budgetUsdCents: number;
                capabilities?: {
                    blocker: string | null;
                    canActivate: boolean;
                    canBeginEdit: boolean;
                    canEdit: boolean;
                    canPause: boolean;
                    canSubmit: boolean;
                    canTrash: boolean;
                } & {
                    [key: string]: unknown;
                };
                category?: string | null;
                channels?: string | null;
                clicksCount?: number;
                contentRevision?: number;
                costPerClickUsdCents?: number;
                costPerImpressionUsdCents?: number;
                createdAt?: string;
                creatives?: ({
                    /** @enum {string} */
                    adFormat?: "banner" | "card" | "video" | "interstitial";
                    adStackId?: string | null;
                    /** @enum {string} */
                    adType?: "text" | "image" | "video";
                    bodyText?: string | null;
                    campaignId: string;
                    ctaText?: string | null;
                    destinationUrl: string;
                    headline?: string | null;
                    id: string;
                    imageSpecs?: ({
                        bytes?: number;
                        height?: number | null;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number | null;
                    } & {
                        [key: string]: unknown;
                    }) | null;
                    imageUrl?: string | null;
                    mediaAssetId?: string | null;
                    /** @enum {string|null} */
                    mediaFormat?: "image" | "gif" | "video" | null;
                    posterUrl?: string | null;
                    rejectionReason?: string | null;
                    /** @enum {string} */
                    reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                    status?: string;
                    videoUrl?: string | null;
                } & {
                    [key: string]: unknown;
                })[];
                currentSubmissionId?: string | null;
                dailyBudgetUsd?: number | null;
                dailyBudgetUsdCents?: number | null;
                defaultStackId?: string;
                description?: string | null;
                endsAt?: string | null;
                /** @enum {string} */
                format: "banner" | "card" | "video" | "interstitial";
                formats?: ("banner" | "card" | "video" | "interstitial")[];
                frequencyCapPerDay?: number;
                geoLocations?: {
                    [key: string]: unknown;
                }[];
                geoMode?: string;
                hourlyPacingUsdCents?: number | null;
                hoversCount?: number;
                id: string;
                impressionsCount?: number;
                /** @enum {string} */
                moderationStatus: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                pricingModel?: string;
                pricingVersion?: number;
                rejectionReason?: string | null;
                remainingBudgetUsd?: number;
                remainingBudgetUsdCents: number;
                schedule?: (({
                    /** @enum {string} */
                    mode: "inherit";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                }) | ({
                    /** @enum {string} */
                    mode: "round_the_clock" | "custom";
                    ranges: ({
                        endMinute: number;
                        startMinute: number;
                    } & {
                        [key: string]: unknown;
                    })[];
                    /** @enum {string} */
                    timezone: "Africa/Lagos";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                })) | null;
                spentUsd?: number;
                startsAt?: string | null;
                /** @enum {string} */
                status: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                submissionIntentId?: string | null;
                submissionRequestId?: string | null;
                submissionState?: string | null;
                submittedAt?: string | null;
                targetCountries?: string | null;
                targetDevices?: (string | string[]) | null;
                targetHours?: (string | number[]) | null;
                targetStates?: string | null;
                title: string;
                touchesCount?: number;
                updatedAt?: string;
            } & {
                [key: string]: unknown;
            }) | null) | null;
            /** @enum {string} */
            status: "success";
        };
        Campaigns_getAdvertiserCampaignsResponse: {
            data: ({
                adStacks?: ({
                    campaignId: string;
                    creatives?: ({
                        /** @enum {string} */
                        adFormat?: "banner" | "card" | "video" | "interstitial";
                        adStackId?: string | null;
                        /** @enum {string} */
                        adType?: "text" | "image" | "video";
                        bodyText?: string | null;
                        campaignId: string;
                        ctaText?: string | null;
                        destinationUrl: string;
                        headline?: string | null;
                        id: string;
                        imageSpecs?: ({
                            bytes?: number;
                            height?: number | null;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number | null;
                        } & {
                            [key: string]: unknown;
                        }) | null;
                        imageUrl?: string | null;
                        mediaAssetId?: string | null;
                        /** @enum {string|null} */
                        mediaFormat?: "image" | "gif" | "video" | null;
                        posterUrl?: string | null;
                        rejectionReason?: string | null;
                        /** @enum {string} */
                        reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                        status?: string;
                        videoUrl?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    effectiveSettings?: {
                        /** @enum {string} */
                        geoMode?: "inherit" | "global" | "targeted";
                        locations?: {
                            [key: string]: unknown;
                        }[];
                        schedule?: ({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        });
                        targetDevices?: string[];
                        targetHours?: number[];
                    } & {
                        [key: string]: unknown;
                    };
                    geoMode?: string;
                    id: string;
                    name: string;
                    position?: number;
                    schedule?: (({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    })) | null;
                    settings?: {
                        /** @enum {string} */
                        geoMode?: "inherit" | "global" | "targeted";
                        locations?: {
                            [key: string]: unknown;
                        }[];
                        schedule?: ({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        });
                        targetDevices?: string[];
                        targetHours?: number[];
                    } & {
                        [key: string]: unknown;
                    };
                    targetDevices?: string | null;
                    targetHours?: string | null;
                } & {
                    [key: string]: unknown;
                })[];
                advertiserId?: string;
                approvedRevision?: number | null;
                approvedSubmissionId?: string | null;
                budgetUsd?: number;
                budgetUsdCents: number;
                capabilities?: {
                    blocker: string | null;
                    canActivate: boolean;
                    canBeginEdit: boolean;
                    canEdit: boolean;
                    canPause: boolean;
                    canSubmit: boolean;
                    canTrash: boolean;
                } & {
                    [key: string]: unknown;
                };
                category?: string | null;
                channels?: string | null;
                clicksCount?: number;
                contentRevision?: number;
                costPerClickUsdCents?: number;
                costPerImpressionUsdCents?: number;
                createdAt?: string;
                creatives?: ({
                    /** @enum {string} */
                    adFormat?: "banner" | "card" | "video" | "interstitial";
                    adStackId?: string | null;
                    /** @enum {string} */
                    adType?: "text" | "image" | "video";
                    bodyText?: string | null;
                    campaignId: string;
                    ctaText?: string | null;
                    destinationUrl: string;
                    headline?: string | null;
                    id: string;
                    imageSpecs?: ({
                        bytes?: number;
                        height?: number | null;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number | null;
                    } & {
                        [key: string]: unknown;
                    }) | null;
                    imageUrl?: string | null;
                    mediaAssetId?: string | null;
                    /** @enum {string|null} */
                    mediaFormat?: "image" | "gif" | "video" | null;
                    posterUrl?: string | null;
                    rejectionReason?: string | null;
                    /** @enum {string} */
                    reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                    status?: string;
                    videoUrl?: string | null;
                } & {
                    [key: string]: unknown;
                })[];
                currentSubmissionId?: string | null;
                dailyBudgetUsd?: number | null;
                dailyBudgetUsdCents?: number | null;
                defaultStackId?: string;
                description?: string | null;
                endsAt?: string | null;
                /** @enum {string} */
                format: "banner" | "card" | "video" | "interstitial";
                formats?: ("banner" | "card" | "video" | "interstitial")[];
                frequencyCapPerDay?: number;
                geoLocations?: {
                    [key: string]: unknown;
                }[];
                geoMode?: string;
                hourlyPacingUsdCents?: number | null;
                hoversCount?: number;
                id: string;
                impressionsCount?: number;
                /** @enum {string} */
                moderationStatus: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                pricingModel?: string;
                pricingVersion?: number;
                rejectionReason?: string | null;
                remainingBudgetUsd?: number;
                remainingBudgetUsdCents: number;
                schedule?: (({
                    /** @enum {string} */
                    mode: "inherit";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                }) | ({
                    /** @enum {string} */
                    mode: "round_the_clock" | "custom";
                    ranges: ({
                        endMinute: number;
                        startMinute: number;
                    } & {
                        [key: string]: unknown;
                    })[];
                    /** @enum {string} */
                    timezone: "Africa/Lagos";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                })) | null;
                spentUsd?: number;
                startsAt?: string | null;
                /** @enum {string} */
                status: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                submissionIntentId?: string | null;
                submissionRequestId?: string | null;
                submissionState?: string | null;
                submittedAt?: string | null;
                targetCountries?: string | null;
                targetDevices?: (string | string[]) | null;
                targetHours?: (string | number[]) | null;
                targetStates?: string | null;
                title: string;
                touchesCount?: number;
                updatedAt?: string;
            } & {
                [key: string]: unknown;
            })[];
            /** @enum {string} */
            status: "success";
        };
        Campaigns_getCampaignDetailsResponse: {
            data: {
                adStacks: ({
                    campaignId: string;
                    creatives?: ({
                        /** @enum {string} */
                        adFormat?: "banner" | "card" | "video" | "interstitial";
                        adStackId?: string | null;
                        /** @enum {string} */
                        adType?: "text" | "image" | "video";
                        bodyText?: string | null;
                        campaignId: string;
                        ctaText?: string | null;
                        destinationUrl: string;
                        headline?: string | null;
                        id: string;
                        imageSpecs?: ({
                            bytes?: number;
                            height?: number | null;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number | null;
                        } & {
                            [key: string]: unknown;
                        }) | null;
                        imageUrl?: string | null;
                        mediaAssetId?: string | null;
                        /** @enum {string|null} */
                        mediaFormat?: "image" | "gif" | "video" | null;
                        posterUrl?: string | null;
                        rejectionReason?: string | null;
                        /** @enum {string} */
                        reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                        status?: string;
                        videoUrl?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    effectiveSettings?: {
                        /** @enum {string} */
                        geoMode?: "inherit" | "global" | "targeted";
                        locations?: {
                            [key: string]: unknown;
                        }[];
                        schedule?: ({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        });
                        targetDevices?: string[];
                        targetHours?: number[];
                    } & {
                        [key: string]: unknown;
                    };
                    geoMode?: string;
                    id: string;
                    name: string;
                    position?: number;
                    schedule?: (({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    })) | null;
                    settings?: {
                        /** @enum {string} */
                        geoMode?: "inherit" | "global" | "targeted";
                        locations?: {
                            [key: string]: unknown;
                        }[];
                        schedule?: ({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        });
                        targetDevices?: string[];
                        targetHours?: number[];
                    } & {
                        [key: string]: unknown;
                    };
                    targetDevices?: string | null;
                    targetHours?: string | null;
                } & {
                    [key: string]: unknown;
                })[];
                advertiserId?: string;
                approvedRevision?: number | null;
                approvedSubmissionId?: string | null;
                budgetUsd?: number;
                budgetUsdCents: number;
                capabilities?: {
                    blocker: string | null;
                    canActivate: boolean;
                    canBeginEdit: boolean;
                    canEdit: boolean;
                    canPause: boolean;
                    canSubmit: boolean;
                    canTrash: boolean;
                } & {
                    [key: string]: unknown;
                };
                category?: string | null;
                channels?: string | null;
                clicksCount?: number;
                contentRevision?: number;
                costPerClickUsdCents?: number;
                costPerImpressionUsdCents?: number;
                createdAt?: string;
                creatives: ({
                    /** @enum {string} */
                    adFormat?: "banner" | "card" | "video" | "interstitial";
                    adStackId?: string | null;
                    /** @enum {string} */
                    adType?: "text" | "image" | "video";
                    bodyText?: string | null;
                    campaignId: string;
                    ctaText?: string | null;
                    destinationUrl: string;
                    headline?: string | null;
                    id: string;
                    imageSpecs?: ({
                        bytes?: number;
                        height?: number | null;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number | null;
                    } & {
                        [key: string]: unknown;
                    }) | null;
                    imageUrl?: string | null;
                    mediaAssetId?: string | null;
                    /** @enum {string|null} */
                    mediaFormat?: "image" | "gif" | "video" | null;
                    posterUrl?: string | null;
                    rejectionReason?: string | null;
                    /** @enum {string} */
                    reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                    status?: string;
                    videoUrl?: string | null;
                } & {
                    [key: string]: unknown;
                })[];
                currentSubmissionId?: string | null;
                dailyBudgetUsd?: number | null;
                dailyBudgetUsdCents?: number | null;
                defaultStackId?: string;
                description?: string | null;
                endsAt?: string | null;
                /** @enum {string} */
                format: "banner" | "card" | "video" | "interstitial";
                formats?: ("banner" | "card" | "video" | "interstitial")[];
                frequencyCapPerDay?: number;
                geoLocations?: {
                    [key: string]: unknown;
                }[];
                geoMode?: string;
                hourlyPacingUsdCents?: number | null;
                hoversCount?: number;
                id: string;
                impressionsCount?: number;
                /** @enum {string} */
                moderationStatus: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                pricingModel?: string;
                pricingVersion?: number;
                rejectionReason?: string | null;
                remainingBudgetUsd?: number;
                remainingBudgetUsdCents: number;
                schedule?: (({
                    /** @enum {string} */
                    mode: "inherit";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                }) | ({
                    /** @enum {string} */
                    mode: "round_the_clock" | "custom";
                    ranges: ({
                        endMinute: number;
                        startMinute: number;
                    } & {
                        [key: string]: unknown;
                    })[];
                    /** @enum {string} */
                    timezone: "Africa/Lagos";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                })) | null;
                spentUsd?: number;
                startsAt?: string | null;
                /** @enum {string} */
                status: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                submissionIntentId?: string | null;
                submissionRequestId?: string | null;
                submissionState?: string | null;
                submittedAt?: string | null;
                targetCountries?: string | null;
                targetDevices?: (string | string[]) | null;
                targetHours?: (string | number[]) | null;
                targetStates?: string | null;
                title: string;
                touchesCount?: number;
                updatedAt?: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Campaigns_getCatalogResponse: {
            data: ({
                category?: string | null;
                createdAt?: string;
                description?: string | null;
                eligibleForPlacement?: boolean;
                /** @enum {string} */
                format?: "banner" | "card" | "video" | "interstitial";
                id: string;
                title: string;
            } & {
                [key: string]: unknown;
            })[];
            /** @enum {string} */
            status: "success";
        };
        Campaigns_getCreationCapabilitiesResponse: {
            data: {
                allowedVideoPlacements?: string[];
                geoTargetingEnabled: boolean;
                imagePreparationEnabled?: boolean;
                scheduleVersion?: number;
                supportedAdTypes: ("text" | "image" | "video")[];
                videoAuthoringEnabled?: boolean;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Campaigns_mutationResultResponse: {
            data: {
                mutation: {
                    [key: string]: unknown;
                } | null;
                submission: ({
                    contentRevision: number;
                    id: string;
                    state: string;
                } & {
                    [key: string]: unknown;
                }) | null;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Campaigns_saveCampaignResponse: {
            data: {
                adStacks?: ({
                    campaignId: string;
                    creatives?: ({
                        /** @enum {string} */
                        adFormat?: "banner" | "card" | "video" | "interstitial";
                        adStackId?: string | null;
                        /** @enum {string} */
                        adType?: "text" | "image" | "video";
                        bodyText?: string | null;
                        campaignId: string;
                        ctaText?: string | null;
                        destinationUrl: string;
                        headline?: string | null;
                        id: string;
                        imageSpecs?: ({
                            bytes?: number;
                            height?: number | null;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number | null;
                        } & {
                            [key: string]: unknown;
                        }) | null;
                        imageUrl?: string | null;
                        mediaAssetId?: string | null;
                        /** @enum {string|null} */
                        mediaFormat?: "image" | "gif" | "video" | null;
                        posterUrl?: string | null;
                        rejectionReason?: string | null;
                        /** @enum {string} */
                        reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                        status?: string;
                        videoUrl?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    effectiveSettings?: {
                        /** @enum {string} */
                        geoMode?: "inherit" | "global" | "targeted";
                        locations?: {
                            [key: string]: unknown;
                        }[];
                        schedule?: ({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        });
                        targetDevices?: string[];
                        targetHours?: number[];
                    } & {
                        [key: string]: unknown;
                    };
                    geoMode?: string;
                    id: string;
                    name: string;
                    position?: number;
                    schedule?: (({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    })) | null;
                    settings?: {
                        /** @enum {string} */
                        geoMode?: "inherit" | "global" | "targeted";
                        locations?: {
                            [key: string]: unknown;
                        }[];
                        schedule?: ({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        });
                        targetDevices?: string[];
                        targetHours?: number[];
                    } & {
                        [key: string]: unknown;
                    };
                    targetDevices?: string | null;
                    targetHours?: string | null;
                } & {
                    [key: string]: unknown;
                })[];
                advertiserId?: string;
                approvedRevision?: number | null;
                approvedSubmissionId?: string | null;
                budgetUsd?: number;
                budgetUsdCents?: number;
                capabilities?: {
                    blocker: string | null;
                    canActivate: boolean;
                    canBeginEdit: boolean;
                    canEdit: boolean;
                    canPause: boolean;
                    canSubmit: boolean;
                    canTrash: boolean;
                } & {
                    [key: string]: unknown;
                };
                category?: string | null;
                channels?: string | null;
                clicksCount?: number;
                contentRevision: number;
                costPerClickUsdCents?: number;
                costPerImpressionUsdCents?: number;
                createdAt?: string;
                creatives?: ({
                    /** @enum {string} */
                    adFormat?: "banner" | "card" | "video" | "interstitial";
                    adStackId?: string | null;
                    /** @enum {string} */
                    adType?: "text" | "image" | "video";
                    bodyText?: string | null;
                    campaignId: string;
                    ctaText?: string | null;
                    destinationUrl: string;
                    headline?: string | null;
                    id: string;
                    imageSpecs?: ({
                        bytes?: number;
                        height?: number | null;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number | null;
                    } & {
                        [key: string]: unknown;
                    }) | null;
                    imageUrl?: string | null;
                    mediaAssetId?: string | null;
                    /** @enum {string|null} */
                    mediaFormat?: "image" | "gif" | "video" | null;
                    posterUrl?: string | null;
                    rejectionReason?: string | null;
                    /** @enum {string} */
                    reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                    status?: string;
                    videoUrl?: string | null;
                } & {
                    [key: string]: unknown;
                })[];
                currentSubmissionId?: string | null;
                dailyBudgetUsd?: number | null;
                dailyBudgetUsdCents?: number | null;
                defaultStackId?: string;
                description?: string | null;
                endsAt?: string | null;
                /** @enum {string} */
                format?: "banner" | "card" | "video" | "interstitial";
                formats?: ("banner" | "card" | "video" | "interstitial")[];
                frequencyCapPerDay?: number;
                geoLocations?: {
                    [key: string]: unknown;
                }[];
                geoMode?: string;
                hourlyPacingUsdCents?: number | null;
                hoversCount?: number;
                id: string;
                impressionsCount?: number;
                /** @enum {string} */
                moderationStatus?: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                pricingModel?: string;
                pricingVersion?: number;
                rejectionReason?: string | null;
                remainingBudgetUsd?: number;
                remainingBudgetUsdCents?: number;
                schedule?: (({
                    /** @enum {string} */
                    mode: "inherit";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                }) | ({
                    /** @enum {string} */
                    mode: "round_the_clock" | "custom";
                    ranges: ({
                        endMinute: number;
                        startMinute: number;
                    } & {
                        [key: string]: unknown;
                    })[];
                    /** @enum {string} */
                    timezone: "Africa/Lagos";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                })) | null;
                spentUsd?: number;
                startsAt?: string | null;
                /** @enum {string} */
                status?: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                submissionIntentId?: string | null;
                submissionRequestId?: string | null;
                submissionState?: string | null;
                submittedAt?: string | null;
                targetCountries?: string | null;
                targetDevices?: (string | string[]) | null;
                targetHours?: (string | number[]) | null;
                targetStates?: string | null;
                title: string;
                touchesCount?: number;
                updatedAt?: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Campaigns_staffCampaignPageResponse: {
            data: {
                items: ({
                    advertiserEmail?: string | null;
                    advertiserId: string;
                    budgetUsd?: number;
                    budgetUsdCents?: number | null;
                    createdAt?: string;
                    dailyBudgetUsd?: number | null;
                    dailyBudgetUsdCents?: number | null;
                    format?: string | null;
                    id: string;
                    moderationStatus: string;
                    pricingModel?: string | null;
                    remainingBudgetUsd?: number;
                    remainingBudgetUsdCents?: number | null;
                    status: string;
                    title: string;
                    updatedAt?: string;
                } & {
                    [key: string]: unknown;
                })[];
                page: number;
                pageSize: number;
                total: number;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Campaigns_staffDeliveryReadinessResponse: {
            data: {
                entityId: string;
                evaluatedAt: string;
                gates: ({
                    action?: string;
                    explanation: string;
                    freshness: string;
                    gateCode: string;
                    observedAt: string | null;
                    owner: string;
                    source: string;
                    /** @enum {string} */
                    status: "eligible" | "blocked" | "action_required" | "pending" | "unknown" | "stale" | "unavailable" | "observed";
                } & {
                    [key: string]: unknown;
                })[];
                /** @enum {string} */
                scope: "campaign" | "website" | "slot";
                version: number;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        CompleteUploadDto: {
            durationSeconds?: number | null;
            height?: number | null;
            thumbnailUrl?: string | null;
            width?: number | null;
        };
        CreateCampaignDto: {
            budgetUsd: number;
            category?: string | null;
            channels?: ("websites" | "individuals" | "mobile_apps")[] | null;
            costPerClickCents?: number | null;
            costPerImpressionCents?: number | null;
            dailyBudgetUsd?: number | null;
            description?: string | null;
            /** @enum {string|null} */
            format?: "banner" | "card" | "video" | "interstitial" | null;
            frequencyCapPerDay?: number | null;
            /** @enum {string|null} */
            geoMode?: "global" | "targeted" | null;
            locations?: string[] | null;
            /** @enum {string|null} */
            pricingModel?: "cpm" | "cpc" | null;
            /** Format: uuid */
            requestId?: string | null;
            schedule?: (({
                /** @enum {string} */
                mode: "inherit";
                /** @enum {integer} */
                version: 1;
            } & {
                [key: string]: unknown;
            }) | ({
                /** @enum {string} */
                mode: "round_the_clock" | "custom";
                ranges: ({
                    endMinute: number;
                    startMinute: number;
                } & {
                    [key: string]: unknown;
                })[];
                /** @enum {string} */
                timezone: "Africa/Lagos";
                /** @enum {integer} */
                version: 1;
            } & {
                [key: string]: unknown;
            })) | null;
            targetCountries?: string[] | null;
            targetDevices?: string[] | null;
            targetHours?: number[] | null;
            targetStates?: string[] | null;
            title: string;
        };
        CreateSetupCheckDto: {
            pagePath?: string | null;
            /** Format: uuid */
            requestId: string;
        };
        CreateSlotDto: {
            allowedAdTypes?: string[] | null;
            allowedPresetIds?: string[] | null;
            format?: string | null;
            height?: number | null;
            name: string;
            responsive?: boolean | null;
            slotDeliveryPreference?: string | null;
            /** @enum {string} */
            slotType: "consideration" | "direct" | "network" | "hybrid";
            websiteId: string;
            width?: number | null;
        };
        CreateStackDto: {
            expectedRevision: number;
            name?: string | null;
            /** Format: uuid */
            requestId: string;
        };
        EmergencyOverrideDto: {
            /** @enum {string} */
            decision: "approved" | "rejected";
            expectedRevision: number;
            overrideReason: string;
            /** Format: uuid */
            requestId: string;
            /** Format: uuid */
            submissionId: string;
        };
        ModerationClaimDto: {
            /** Format: uuid */
            claimId?: string | null;
            expectedRevision: number;
            reason?: string | null;
            /** Format: uuid */
            requestId: string;
            /** @enum {string} */
            stage: "reviewer" | "manager";
            /** Format: uuid */
            submissionId: string;
        };
        Moderation_acquireClaimResponse: {
            data: {
                claim: ({
                    campaignId: string;
                    claimantId: string;
                    claimedAt: string;
                    contentRevision: number;
                    expiresAt: string;
                    id: string;
                    releasedAt: string | null;
                    /** @enum {string} */
                    stage: "reviewer" | "manager";
                    submissionId: string;
                    targetId: string;
                    /** @enum {string} */
                    targetType: "creative" | "stack" | "campaign";
                } & {
                    [key: string]: unknown;
                }) | null;
                enabled: boolean;
                /** @enum {string} */
                outcome: "acquired" | "renewed" | "released" | "taken_over" | "held_by_you" | "held_by_other";
                policy: {
                    maxLifetimeSeconds: number;
                    renewal: string;
                    ttlSeconds: number;
                } & {
                    [key: string]: unknown;
                };
                serverTime: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Moderation_changeAuditResponse: {
            data: ({
                action: string;
                actorId: string;
                afterHash: string;
                beforeHash: string;
                changedFields: string[];
                contentRevision: number;
                createdAt: string;
                entityIds: string[];
                id: string;
                previousSubmissionId: string | null;
                priorRevision: number;
                requestId: string;
                submissionId: string | null;
            } & {
                [key: string]: unknown;
            })[];
            /** @enum {string} */
            status: "success";
        };
        Moderation_getClaimResponse: {
            data: {
                claim: ({
                    campaignId: string;
                    claimantId: string;
                    claimedAt: string;
                    contentRevision: number;
                    expiresAt: string;
                    id: string;
                    releasedAt: string | null;
                    /** @enum {string} */
                    stage: "reviewer" | "manager";
                    submissionId: string;
                    targetId: string;
                    /** @enum {string} */
                    targetType: "creative" | "stack" | "campaign";
                } & {
                    [key: string]: unknown;
                }) | null;
                enabled: boolean;
                policy: {
                    maxLifetimeSeconds: number;
                    renewal: string;
                    ttlSeconds: number;
                } & {
                    [key: string]: unknown;
                };
                serverTime: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Moderation_getQueueResponse: {
            data: {
                asOf?: string;
                campaigns: ({
                    advertiserId: string;
                    approvedCreativesCount: number;
                    budgetUsdCents: number;
                    contentRevision: number;
                    createdAt: string;
                    id: string;
                    /** @enum {string} */
                    moderationStatus: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                    pricingModel: string;
                    reviewClock: ({
                        stageStartedAt: string | null;
                        submittedAt: string | null;
                    } & {
                        [key: string]: unknown;
                    }) | null;
                    /** @enum {string} */
                    status: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                    submissionId: string;
                    title: string;
                    totalCreativesCount: number;
                } & {
                    [key: string]: unknown;
                })[];
                /** @enum {string} */
                countScope?: "loaded_page";
                creatives: ({
                    /** @enum {string} */
                    adFormat?: "banner" | "card" | "video" | "interstitial";
                    adStackId?: string | null;
                    /** @enum {string} */
                    adType?: "text" | "image" | "video";
                    bodyText?: string | null;
                    campaignId: string;
                    contentRevision: number;
                    ctaText?: string | null;
                    destinationUrl: string;
                    headline?: string | null;
                    id: string;
                    imageSpecs?: ({
                        bytes?: number;
                        height?: number | null;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number | null;
                    } & {
                        [key: string]: unknown;
                    }) | null;
                    imageUrl?: string | null;
                    mediaAssetId?: string | null;
                    /** @enum {string|null} */
                    mediaFormat?: "image" | "gif" | "video" | null;
                    posterUrl?: string | null;
                    rejectionReason?: string | null;
                    reviewClock?: ({
                        stageStartedAt: string | null;
                        submittedAt: string | null;
                    } & {
                        [key: string]: unknown;
                    }) | null;
                    /** @enum {string} */
                    reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                    status?: string;
                    submissionId: string;
                    videoUrl?: string | null;
                } & {
                    [key: string]: unknown;
                })[];
                hasMore?: {
                    campaigns: boolean;
                    creatives: boolean;
                    stacks: boolean;
                } & {
                    [key: string]: unknown;
                };
                page?: number;
                pageSize?: number;
                stacks: ({
                    campaignId: string;
                    campaignTitle: string;
                    contentRevision: number;
                    id: string;
                    name: string;
                    reviewClock: ({
                        stageStartedAt: string | null;
                        submittedAt: string | null;
                    } & {
                        [key: string]: unknown;
                    }) | null;
                    reviewStatus: string;
                    submissionId: string;
                } & {
                    [key: string]: unknown;
                })[];
                totalPending: number;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Moderation_itemDetailResponse: {
            data: {
                campaign: {
                    adStacks?: ({
                        campaignId: string;
                        creatives?: ({
                            /** @enum {string} */
                            adFormat?: "banner" | "card" | "video" | "interstitial";
                            adStackId?: string | null;
                            /** @enum {string} */
                            adType?: "text" | "image" | "video";
                            bodyText?: string | null;
                            campaignId: string;
                            ctaText?: string | null;
                            destinationUrl: string;
                            headline?: string | null;
                            id: string;
                            imageSpecs?: ({
                                bytes?: number;
                                height?: number | null;
                                mimeType?: string;
                                preparation?: {
                                    [key: string]: unknown;
                                } | null;
                                renditions?: {
                                    [key: string]: unknown;
                                }[];
                                sha256?: string | null;
                                width?: number | null;
                            } & {
                                [key: string]: unknown;
                            }) | null;
                            imageUrl?: string | null;
                            mediaAssetId?: string | null;
                            /** @enum {string|null} */
                            mediaFormat?: "image" | "gif" | "video" | null;
                            posterUrl?: string | null;
                            rejectionReason?: string | null;
                            /** @enum {string} */
                            reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                            status?: string;
                            videoUrl?: string | null;
                        } & {
                            [key: string]: unknown;
                        })[];
                        effectiveSettings?: {
                            /** @enum {string} */
                            geoMode?: "inherit" | "global" | "targeted";
                            locations?: {
                                [key: string]: unknown;
                            }[];
                            schedule?: ({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            });
                            targetDevices?: string[];
                            targetHours?: number[];
                        } & {
                            [key: string]: unknown;
                        };
                        geoMode?: string;
                        id: string;
                        name: string;
                        position?: number;
                        schedule?: (({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        })) | null;
                        settings?: {
                            /** @enum {string} */
                            geoMode?: "inherit" | "global" | "targeted";
                            locations?: {
                                [key: string]: unknown;
                            }[];
                            schedule?: ({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            });
                            targetDevices?: string[];
                            targetHours?: number[];
                        } & {
                            [key: string]: unknown;
                        };
                        targetDevices?: string | null;
                        targetHours?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    advertiserId?: string;
                    approvedRevision?: number | null;
                    approvedSubmissionId?: string | null;
                    budgetUsd?: number;
                    budgetUsdCents: number;
                    capabilities?: {
                        blocker: string | null;
                        canActivate: boolean;
                        canBeginEdit: boolean;
                        canEdit: boolean;
                        canPause: boolean;
                        canSubmit: boolean;
                        canTrash: boolean;
                    } & {
                        [key: string]: unknown;
                    };
                    category?: string | null;
                    channels?: string | null;
                    clicksCount?: number;
                    contentRevision?: number;
                    costPerClickUsdCents?: number;
                    costPerImpressionUsdCents?: number;
                    createdAt?: string;
                    creatives?: ({
                        /** @enum {string} */
                        adFormat?: "banner" | "card" | "video" | "interstitial";
                        adStackId?: string | null;
                        /** @enum {string} */
                        adType?: "text" | "image" | "video";
                        bodyText?: string | null;
                        campaignId: string;
                        ctaText?: string | null;
                        destinationUrl: string;
                        headline?: string | null;
                        id: string;
                        imageSpecs?: ({
                            bytes?: number;
                            height?: number | null;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number | null;
                        } & {
                            [key: string]: unknown;
                        }) | null;
                        imageUrl?: string | null;
                        mediaAssetId?: string | null;
                        /** @enum {string|null} */
                        mediaFormat?: "image" | "gif" | "video" | null;
                        posterUrl?: string | null;
                        rejectionReason?: string | null;
                        /** @enum {string} */
                        reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                        status?: string;
                        videoUrl?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    currentSubmissionId?: string | null;
                    dailyBudgetUsd?: number | null;
                    dailyBudgetUsdCents?: number | null;
                    defaultStackId?: string;
                    description?: string | null;
                    endsAt?: string | null;
                    /** @enum {string} */
                    format: "banner" | "card" | "video" | "interstitial";
                    formats?: ("banner" | "card" | "video" | "interstitial")[];
                    frequencyCapPerDay?: number;
                    geoLocations?: {
                        [key: string]: unknown;
                    }[];
                    geoMode?: string;
                    hourlyPacingUsdCents?: number | null;
                    hoversCount?: number;
                    id: string;
                    impressionsCount?: number;
                    /** @enum {string} */
                    moderationStatus: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                    pricingModel?: string;
                    pricingVersion?: number;
                    rejectionReason?: string | null;
                    remainingBudgetUsd?: number;
                    remainingBudgetUsdCents: number;
                    schedule?: (({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    })) | null;
                    spentUsd?: number;
                    startsAt?: string | null;
                    /** @enum {string} */
                    status: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                    submissionIntentId?: string | null;
                    submissionRequestId?: string | null;
                    submissionState?: string | null;
                    submittedAt?: string | null;
                    targetCountries?: string | null;
                    targetDevices?: (string | string[]) | null;
                    targetHours?: (string | number[]) | null;
                    targetStates?: string | null;
                    title: string;
                    touchesCount?: number;
                    updatedAt?: string;
                } & {
                    [key: string]: unknown;
                };
                capabilities: {
                    manager: {
                        allowed: boolean;
                        reason: string | null;
                    } & {
                        [key: string]: unknown;
                    };
                    reviewer: {
                        allowed: boolean;
                        reason: string | null;
                    } & {
                        [key: string]: unknown;
                    };
                } & {
                    [key: string]: unknown;
                };
                children: {
                    [key: string]: unknown;
                }[];
                content: {
                    [key: string]: unknown;
                } | null;
                contentRevision: number | null;
                creativeProgress: {
                    approved: number | null;
                    total: number | null;
                } & {
                    [key: string]: unknown;
                };
                hasMoreChildren: boolean;
                hasMoreHistory: boolean;
                history: {
                    [key: string]: unknown;
                }[];
                item: {
                    [key: string]: unknown;
                };
                page: number;
                reviewOptions: {
                    customExplanationAllowed: boolean;
                    noteMaxLength: number;
                    reasons: ({
                        code: string;
                        label: string;
                    } & {
                        [key: string]: unknown;
                    })[];
                } & {
                    [key: string]: unknown;
                };
                submissionId: string | null;
                targetId: string;
                /** @enum {string} */
                targetType: "creative" | "stack" | "campaign";
                targets: {
                    [key: string]: unknown;
                }[];
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Moderation_operationsSummaryResponse: {
            data: {
                asOf: string;
                managerCount: number;
                oldestAgeSeconds: number | null;
                oldestSubmittedAt: string | null;
                overdueCount: number | null;
                reviewerCount: number;
                /** @enum {string} */
                scope: "all" | "creative" | "stack" | "campaign";
                submissionCount: number;
                /** @enum {string} */
                targetStatus: "not_configured";
                unknownAgeCount: number;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Moderation_primaryReviewCampaignResponse: {
            data: {
                campaign: {
                    adStacks?: ({
                        campaignId: string;
                        creatives?: ({
                            /** @enum {string} */
                            adFormat?: "banner" | "card" | "video" | "interstitial";
                            adStackId?: string | null;
                            /** @enum {string} */
                            adType?: "text" | "image" | "video";
                            bodyText?: string | null;
                            campaignId: string;
                            ctaText?: string | null;
                            destinationUrl: string;
                            headline?: string | null;
                            id: string;
                            imageSpecs?: ({
                                bytes?: number;
                                height?: number | null;
                                mimeType?: string;
                                preparation?: {
                                    [key: string]: unknown;
                                } | null;
                                renditions?: {
                                    [key: string]: unknown;
                                }[];
                                sha256?: string | null;
                                width?: number | null;
                            } & {
                                [key: string]: unknown;
                            }) | null;
                            imageUrl?: string | null;
                            mediaAssetId?: string | null;
                            /** @enum {string|null} */
                            mediaFormat?: "image" | "gif" | "video" | null;
                            posterUrl?: string | null;
                            rejectionReason?: string | null;
                            /** @enum {string} */
                            reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                            status?: string;
                            videoUrl?: string | null;
                        } & {
                            [key: string]: unknown;
                        })[];
                        effectiveSettings?: {
                            /** @enum {string} */
                            geoMode?: "inherit" | "global" | "targeted";
                            locations?: {
                                [key: string]: unknown;
                            }[];
                            schedule?: ({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            });
                            targetDevices?: string[];
                            targetHours?: number[];
                        } & {
                            [key: string]: unknown;
                        };
                        geoMode?: string;
                        id: string;
                        name: string;
                        position?: number;
                        schedule?: (({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        })) | null;
                        settings?: {
                            /** @enum {string} */
                            geoMode?: "inherit" | "global" | "targeted";
                            locations?: {
                                [key: string]: unknown;
                            }[];
                            schedule?: ({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            });
                            targetDevices?: string[];
                            targetHours?: number[];
                        } & {
                            [key: string]: unknown;
                        };
                        targetDevices?: string | null;
                        targetHours?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    advertiserId?: string;
                    approvedRevision?: number | null;
                    approvedSubmissionId?: string | null;
                    budgetUsd?: number;
                    budgetUsdCents: number;
                    capabilities?: {
                        blocker: string | null;
                        canActivate: boolean;
                        canBeginEdit: boolean;
                        canEdit: boolean;
                        canPause: boolean;
                        canSubmit: boolean;
                        canTrash: boolean;
                    } & {
                        [key: string]: unknown;
                    };
                    category?: string | null;
                    channels?: string | null;
                    clicksCount?: number;
                    contentRevision?: number;
                    costPerClickUsdCents?: number;
                    costPerImpressionUsdCents?: number;
                    createdAt?: string;
                    creatives?: ({
                        /** @enum {string} */
                        adFormat?: "banner" | "card" | "video" | "interstitial";
                        adStackId?: string | null;
                        /** @enum {string} */
                        adType?: "text" | "image" | "video";
                        bodyText?: string | null;
                        campaignId: string;
                        ctaText?: string | null;
                        destinationUrl: string;
                        headline?: string | null;
                        id: string;
                        imageSpecs?: ({
                            bytes?: number;
                            height?: number | null;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number | null;
                        } & {
                            [key: string]: unknown;
                        }) | null;
                        imageUrl?: string | null;
                        mediaAssetId?: string | null;
                        /** @enum {string|null} */
                        mediaFormat?: "image" | "gif" | "video" | null;
                        posterUrl?: string | null;
                        rejectionReason?: string | null;
                        /** @enum {string} */
                        reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                        status?: string;
                        videoUrl?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    currentSubmissionId?: string | null;
                    dailyBudgetUsd?: number | null;
                    dailyBudgetUsdCents?: number | null;
                    defaultStackId?: string;
                    description?: string | null;
                    endsAt?: string | null;
                    /** @enum {string} */
                    format: "banner" | "card" | "video" | "interstitial";
                    formats?: ("banner" | "card" | "video" | "interstitial")[];
                    frequencyCapPerDay?: number;
                    geoLocations?: {
                        [key: string]: unknown;
                    }[];
                    geoMode?: string;
                    hourlyPacingUsdCents?: number | null;
                    hoversCount?: number;
                    id: string;
                    impressionsCount?: number;
                    /** @enum {string} */
                    moderationStatus: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                    pricingModel?: string;
                    pricingVersion?: number;
                    rejectionReason?: string | null;
                    remainingBudgetUsd?: number;
                    remainingBudgetUsdCents: number;
                    schedule?: (({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    })) | null;
                    spentUsd?: number;
                    startsAt?: string | null;
                    /** @enum {string} */
                    status: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                    submissionIntentId?: string | null;
                    submissionRequestId?: string | null;
                    submissionState?: string | null;
                    submittedAt?: string | null;
                    targetCountries?: string | null;
                    targetDevices?: (string | string[]) | null;
                    targetHours?: (string | number[]) | null;
                    targetStates?: string | null;
                    title: string;
                    touchesCount?: number;
                    updatedAt?: string;
                } & {
                    [key: string]: unknown;
                };
                decision: {
                    decision: string;
                    id: string;
                    reviewerId: string;
                    targetId: string;
                    /** @enum {string} */
                    targetType: "campaign" | "creative" | "stack";
                } & {
                    [key: string]: unknown;
                };
                isEmergencyOverride?: boolean;
                live?: boolean;
                nextStage?: string;
                stage?: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Moderation_primaryReviewCreativeResponse: {
            data: {
                campaign?: {
                    adStacks?: ({
                        campaignId: string;
                        creatives?: ({
                            /** @enum {string} */
                            adFormat?: "banner" | "card" | "video" | "interstitial";
                            adStackId?: string | null;
                            /** @enum {string} */
                            adType?: "text" | "image" | "video";
                            bodyText?: string | null;
                            campaignId: string;
                            ctaText?: string | null;
                            destinationUrl: string;
                            headline?: string | null;
                            id: string;
                            imageSpecs?: ({
                                bytes?: number;
                                height?: number | null;
                                mimeType?: string;
                                preparation?: {
                                    [key: string]: unknown;
                                } | null;
                                renditions?: {
                                    [key: string]: unknown;
                                }[];
                                sha256?: string | null;
                                width?: number | null;
                            } & {
                                [key: string]: unknown;
                            }) | null;
                            imageUrl?: string | null;
                            mediaAssetId?: string | null;
                            /** @enum {string|null} */
                            mediaFormat?: "image" | "gif" | "video" | null;
                            posterUrl?: string | null;
                            rejectionReason?: string | null;
                            /** @enum {string} */
                            reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                            status?: string;
                            videoUrl?: string | null;
                        } & {
                            [key: string]: unknown;
                        })[];
                        effectiveSettings?: {
                            /** @enum {string} */
                            geoMode?: "inherit" | "global" | "targeted";
                            locations?: {
                                [key: string]: unknown;
                            }[];
                            schedule?: ({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            });
                            targetDevices?: string[];
                            targetHours?: number[];
                        } & {
                            [key: string]: unknown;
                        };
                        geoMode?: string;
                        id: string;
                        name: string;
                        position?: number;
                        schedule?: (({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        })) | null;
                        settings?: {
                            /** @enum {string} */
                            geoMode?: "inherit" | "global" | "targeted";
                            locations?: {
                                [key: string]: unknown;
                            }[];
                            schedule?: ({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            });
                            targetDevices?: string[];
                            targetHours?: number[];
                        } & {
                            [key: string]: unknown;
                        };
                        targetDevices?: string | null;
                        targetHours?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    advertiserId?: string;
                    approvedRevision?: number | null;
                    approvedSubmissionId?: string | null;
                    budgetUsd?: number;
                    budgetUsdCents: number;
                    capabilities?: {
                        blocker: string | null;
                        canActivate: boolean;
                        canBeginEdit: boolean;
                        canEdit: boolean;
                        canPause: boolean;
                        canSubmit: boolean;
                        canTrash: boolean;
                    } & {
                        [key: string]: unknown;
                    };
                    category?: string | null;
                    channels?: string | null;
                    clicksCount?: number;
                    contentRevision?: number;
                    costPerClickUsdCents?: number;
                    costPerImpressionUsdCents?: number;
                    createdAt?: string;
                    creatives?: ({
                        /** @enum {string} */
                        adFormat?: "banner" | "card" | "video" | "interstitial";
                        adStackId?: string | null;
                        /** @enum {string} */
                        adType?: "text" | "image" | "video";
                        bodyText?: string | null;
                        campaignId: string;
                        ctaText?: string | null;
                        destinationUrl: string;
                        headline?: string | null;
                        id: string;
                        imageSpecs?: ({
                            bytes?: number;
                            height?: number | null;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number | null;
                        } & {
                            [key: string]: unknown;
                        }) | null;
                        imageUrl?: string | null;
                        mediaAssetId?: string | null;
                        /** @enum {string|null} */
                        mediaFormat?: "image" | "gif" | "video" | null;
                        posterUrl?: string | null;
                        rejectionReason?: string | null;
                        /** @enum {string} */
                        reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                        status?: string;
                        videoUrl?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    currentSubmissionId?: string | null;
                    dailyBudgetUsd?: number | null;
                    dailyBudgetUsdCents?: number | null;
                    defaultStackId?: string;
                    description?: string | null;
                    endsAt?: string | null;
                    /** @enum {string} */
                    format: "banner" | "card" | "video" | "interstitial";
                    formats?: ("banner" | "card" | "video" | "interstitial")[];
                    frequencyCapPerDay?: number;
                    geoLocations?: {
                        [key: string]: unknown;
                    }[];
                    geoMode?: string;
                    hourlyPacingUsdCents?: number | null;
                    hoversCount?: number;
                    id: string;
                    impressionsCount?: number;
                    /** @enum {string} */
                    moderationStatus: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                    pricingModel?: string;
                    pricingVersion?: number;
                    rejectionReason?: string | null;
                    remainingBudgetUsd?: number;
                    remainingBudgetUsdCents: number;
                    schedule?: (({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    })) | null;
                    spentUsd?: number;
                    startsAt?: string | null;
                    /** @enum {string} */
                    status: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                    submissionIntentId?: string | null;
                    submissionRequestId?: string | null;
                    submissionState?: string | null;
                    submittedAt?: string | null;
                    targetCountries?: string | null;
                    targetDevices?: (string | string[]) | null;
                    targetHours?: (string | number[]) | null;
                    targetStates?: string | null;
                    title: string;
                    touchesCount?: number;
                    updatedAt?: string;
                } & {
                    [key: string]: unknown;
                };
                creative: {
                    /** @enum {string} */
                    adFormat?: "banner" | "card" | "video" | "interstitial";
                    adStackId?: string | null;
                    /** @enum {string} */
                    adType?: "text" | "image" | "video";
                    bodyText?: string | null;
                    campaignId: string;
                    ctaText?: string | null;
                    destinationUrl: string;
                    headline?: string | null;
                    id: string;
                    imageSpecs?: ({
                        bytes?: number;
                        height?: number | null;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number | null;
                    } & {
                        [key: string]: unknown;
                    }) | null;
                    imageUrl?: string | null;
                    mediaAssetId?: string | null;
                    /** @enum {string|null} */
                    mediaFormat?: "image" | "gif" | "video" | null;
                    posterUrl?: string | null;
                    rejectionReason?: string | null;
                    /** @enum {string} */
                    reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                    status?: string;
                    videoUrl?: string | null;
                } & {
                    [key: string]: unknown;
                };
                decision: {
                    decision: string;
                    id: string;
                    reviewerId: string;
                    targetId: string;
                    /** @enum {string} */
                    targetType: "campaign" | "creative" | "stack";
                } & {
                    [key: string]: unknown;
                };
                nextStage?: string;
                stage?: string;
                targetId?: string;
                /** @enum {string} */
                targetType?: "creative";
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Moderation_primaryReviewStackResponse: {
            data: {
                campaign?: {
                    adStacks?: ({
                        campaignId: string;
                        creatives?: ({
                            /** @enum {string} */
                            adFormat?: "banner" | "card" | "video" | "interstitial";
                            adStackId?: string | null;
                            /** @enum {string} */
                            adType?: "text" | "image" | "video";
                            bodyText?: string | null;
                            campaignId: string;
                            ctaText?: string | null;
                            destinationUrl: string;
                            headline?: string | null;
                            id: string;
                            imageSpecs?: ({
                                bytes?: number;
                                height?: number | null;
                                mimeType?: string;
                                preparation?: {
                                    [key: string]: unknown;
                                } | null;
                                renditions?: {
                                    [key: string]: unknown;
                                }[];
                                sha256?: string | null;
                                width?: number | null;
                            } & {
                                [key: string]: unknown;
                            }) | null;
                            imageUrl?: string | null;
                            mediaAssetId?: string | null;
                            /** @enum {string|null} */
                            mediaFormat?: "image" | "gif" | "video" | null;
                            posterUrl?: string | null;
                            rejectionReason?: string | null;
                            /** @enum {string} */
                            reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                            status?: string;
                            videoUrl?: string | null;
                        } & {
                            [key: string]: unknown;
                        })[];
                        effectiveSettings?: {
                            /** @enum {string} */
                            geoMode?: "inherit" | "global" | "targeted";
                            locations?: {
                                [key: string]: unknown;
                            }[];
                            schedule?: ({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            });
                            targetDevices?: string[];
                            targetHours?: number[];
                        } & {
                            [key: string]: unknown;
                        };
                        geoMode?: string;
                        id: string;
                        name: string;
                        position?: number;
                        schedule?: (({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        })) | null;
                        settings?: {
                            /** @enum {string} */
                            geoMode?: "inherit" | "global" | "targeted";
                            locations?: {
                                [key: string]: unknown;
                            }[];
                            schedule?: ({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            });
                            targetDevices?: string[];
                            targetHours?: number[];
                        } & {
                            [key: string]: unknown;
                        };
                        targetDevices?: string | null;
                        targetHours?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    advertiserId?: string;
                    approvedRevision?: number | null;
                    approvedSubmissionId?: string | null;
                    budgetUsd?: number;
                    budgetUsdCents: number;
                    capabilities?: {
                        blocker: string | null;
                        canActivate: boolean;
                        canBeginEdit: boolean;
                        canEdit: boolean;
                        canPause: boolean;
                        canSubmit: boolean;
                        canTrash: boolean;
                    } & {
                        [key: string]: unknown;
                    };
                    category?: string | null;
                    channels?: string | null;
                    clicksCount?: number;
                    contentRevision?: number;
                    costPerClickUsdCents?: number;
                    costPerImpressionUsdCents?: number;
                    createdAt?: string;
                    creatives?: ({
                        /** @enum {string} */
                        adFormat?: "banner" | "card" | "video" | "interstitial";
                        adStackId?: string | null;
                        /** @enum {string} */
                        adType?: "text" | "image" | "video";
                        bodyText?: string | null;
                        campaignId: string;
                        ctaText?: string | null;
                        destinationUrl: string;
                        headline?: string | null;
                        id: string;
                        imageSpecs?: ({
                            bytes?: number;
                            height?: number | null;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number | null;
                        } & {
                            [key: string]: unknown;
                        }) | null;
                        imageUrl?: string | null;
                        mediaAssetId?: string | null;
                        /** @enum {string|null} */
                        mediaFormat?: "image" | "gif" | "video" | null;
                        posterUrl?: string | null;
                        rejectionReason?: string | null;
                        /** @enum {string} */
                        reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                        status?: string;
                        videoUrl?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    currentSubmissionId?: string | null;
                    dailyBudgetUsd?: number | null;
                    dailyBudgetUsdCents?: number | null;
                    defaultStackId?: string;
                    description?: string | null;
                    endsAt?: string | null;
                    /** @enum {string} */
                    format: "banner" | "card" | "video" | "interstitial";
                    formats?: ("banner" | "card" | "video" | "interstitial")[];
                    frequencyCapPerDay?: number;
                    geoLocations?: {
                        [key: string]: unknown;
                    }[];
                    geoMode?: string;
                    hourlyPacingUsdCents?: number | null;
                    hoversCount?: number;
                    id: string;
                    impressionsCount?: number;
                    /** @enum {string} */
                    moderationStatus: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                    pricingModel?: string;
                    pricingVersion?: number;
                    rejectionReason?: string | null;
                    remainingBudgetUsd?: number;
                    remainingBudgetUsdCents: number;
                    schedule?: (({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    })) | null;
                    spentUsd?: number;
                    startsAt?: string | null;
                    /** @enum {string} */
                    status: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                    submissionIntentId?: string | null;
                    submissionRequestId?: string | null;
                    submissionState?: string | null;
                    submittedAt?: string | null;
                    targetCountries?: string | null;
                    targetDevices?: (string | string[]) | null;
                    targetHours?: (string | number[]) | null;
                    targetStates?: string | null;
                    title: string;
                    touchesCount?: number;
                    updatedAt?: string;
                } & {
                    [key: string]: unknown;
                };
                decision: {
                    decision: string;
                    id: string;
                    reviewerId: string;
                    targetId: string;
                    /** @enum {string} */
                    targetType: "campaign" | "creative" | "stack";
                } & {
                    [key: string]: unknown;
                };
                nextStage?: string;
                stack: {
                    campaignId: string;
                    creatives?: ({
                        /** @enum {string} */
                        adFormat?: "banner" | "card" | "video" | "interstitial";
                        adStackId?: string | null;
                        /** @enum {string} */
                        adType?: "text" | "image" | "video";
                        bodyText?: string | null;
                        campaignId: string;
                        ctaText?: string | null;
                        destinationUrl: string;
                        headline?: string | null;
                        id: string;
                        imageSpecs?: ({
                            bytes?: number;
                            height?: number | null;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number | null;
                        } & {
                            [key: string]: unknown;
                        }) | null;
                        imageUrl?: string | null;
                        mediaAssetId?: string | null;
                        /** @enum {string|null} */
                        mediaFormat?: "image" | "gif" | "video" | null;
                        posterUrl?: string | null;
                        rejectionReason?: string | null;
                        /** @enum {string} */
                        reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                        status?: string;
                        videoUrl?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    effectiveSettings?: {
                        /** @enum {string} */
                        geoMode?: "inherit" | "global" | "targeted";
                        locations?: {
                            [key: string]: unknown;
                        }[];
                        schedule?: ({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        });
                        targetDevices?: string[];
                        targetHours?: number[];
                    } & {
                        [key: string]: unknown;
                    };
                    geoMode?: string;
                    id: string;
                    name: string;
                    position?: number;
                    schedule?: (({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    })) | null;
                    settings?: {
                        /** @enum {string} */
                        geoMode?: "inherit" | "global" | "targeted";
                        locations?: {
                            [key: string]: unknown;
                        }[];
                        schedule?: ({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        });
                        targetDevices?: string[];
                        targetHours?: number[];
                    } & {
                        [key: string]: unknown;
                    };
                    targetDevices?: string | null;
                    targetHours?: string | null;
                } & {
                    [key: string]: unknown;
                };
                stage?: string;
                targetId?: string;
                /** @enum {string} */
                targetType?: "stack";
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Moderation_reviewCreativeResponse: {
            data: {
                creative: {
                    /** @enum {string} */
                    adFormat?: "banner" | "card" | "video" | "interstitial";
                    adStackId?: string | null;
                    /** @enum {string} */
                    adType?: "text" | "image" | "video";
                    bodyText?: string | null;
                    campaignId: string;
                    ctaText?: string | null;
                    destinationUrl: string;
                    headline?: string | null;
                    id: string;
                    imageSpecs?: ({
                        bytes?: number;
                        height?: number | null;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number | null;
                    } & {
                        [key: string]: unknown;
                    }) | null;
                    imageUrl?: string | null;
                    mediaAssetId?: string | null;
                    /** @enum {string|null} */
                    mediaFormat?: "image" | "gif" | "video" | null;
                    posterUrl?: string | null;
                    rejectionReason?: string | null;
                    /** @enum {string} */
                    reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                    status?: string;
                    videoUrl?: string | null;
                } & {
                    [key: string]: unknown;
                };
                decision: {
                    decision: string;
                    id: string;
                    reviewerId: string;
                    targetId: string;
                    /** @enum {string} */
                    targetType: "campaign" | "creative" | "stack";
                } & {
                    [key: string]: unknown;
                };
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Moderation_reviewReceiptResponse: {
            data: {
                requestId: string;
                result: {
                    campaign: {
                        adStacks?: ({
                            campaignId: string;
                            creatives?: ({
                                /** @enum {string} */
                                adFormat?: "banner" | "card" | "video" | "interstitial";
                                adStackId?: string | null;
                                /** @enum {string} */
                                adType?: "text" | "image" | "video";
                                bodyText?: string | null;
                                campaignId: string;
                                ctaText?: string | null;
                                destinationUrl: string;
                                headline?: string | null;
                                id: string;
                                imageSpecs?: ({
                                    bytes?: number;
                                    height?: number | null;
                                    mimeType?: string;
                                    preparation?: {
                                        [key: string]: unknown;
                                    } | null;
                                    renditions?: {
                                        [key: string]: unknown;
                                    }[];
                                    sha256?: string | null;
                                    width?: number | null;
                                } & {
                                    [key: string]: unknown;
                                }) | null;
                                imageUrl?: string | null;
                                mediaAssetId?: string | null;
                                /** @enum {string|null} */
                                mediaFormat?: "image" | "gif" | "video" | null;
                                posterUrl?: string | null;
                                rejectionReason?: string | null;
                                /** @enum {string} */
                                reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                                status?: string;
                                videoUrl?: string | null;
                            } & {
                                [key: string]: unknown;
                            })[];
                            effectiveSettings?: {
                                /** @enum {string} */
                                geoMode?: "inherit" | "global" | "targeted";
                                locations?: {
                                    [key: string]: unknown;
                                }[];
                                schedule?: ({
                                    /** @enum {string} */
                                    mode: "inherit";
                                    /** @enum {integer} */
                                    version: 1;
                                } & {
                                    [key: string]: unknown;
                                }) | ({
                                    /** @enum {string} */
                                    mode: "round_the_clock" | "custom";
                                    ranges: ({
                                        endMinute: number;
                                        startMinute: number;
                                    } & {
                                        [key: string]: unknown;
                                    })[];
                                    /** @enum {string} */
                                    timezone: "Africa/Lagos";
                                    /** @enum {integer} */
                                    version: 1;
                                } & {
                                    [key: string]: unknown;
                                });
                                targetDevices?: string[];
                                targetHours?: number[];
                            } & {
                                [key: string]: unknown;
                            };
                            geoMode?: string;
                            id: string;
                            name: string;
                            position?: number;
                            schedule?: (({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            })) | null;
                            settings?: {
                                /** @enum {string} */
                                geoMode?: "inherit" | "global" | "targeted";
                                locations?: {
                                    [key: string]: unknown;
                                }[];
                                schedule?: ({
                                    /** @enum {string} */
                                    mode: "inherit";
                                    /** @enum {integer} */
                                    version: 1;
                                } & {
                                    [key: string]: unknown;
                                }) | ({
                                    /** @enum {string} */
                                    mode: "round_the_clock" | "custom";
                                    ranges: ({
                                        endMinute: number;
                                        startMinute: number;
                                    } & {
                                        [key: string]: unknown;
                                    })[];
                                    /** @enum {string} */
                                    timezone: "Africa/Lagos";
                                    /** @enum {integer} */
                                    version: 1;
                                } & {
                                    [key: string]: unknown;
                                });
                                targetDevices?: string[];
                                targetHours?: number[];
                            } & {
                                [key: string]: unknown;
                            };
                            targetDevices?: string | null;
                            targetHours?: string | null;
                        } & {
                            [key: string]: unknown;
                        })[];
                        advertiserId?: string;
                        approvedRevision?: number | null;
                        approvedSubmissionId?: string | null;
                        budgetUsd?: number;
                        budgetUsdCents: number;
                        capabilities?: {
                            blocker: string | null;
                            canActivate: boolean;
                            canBeginEdit: boolean;
                            canEdit: boolean;
                            canPause: boolean;
                            canSubmit: boolean;
                            canTrash: boolean;
                        } & {
                            [key: string]: unknown;
                        };
                        category?: string | null;
                        channels?: string | null;
                        clicksCount?: number;
                        contentRevision?: number;
                        costPerClickUsdCents?: number;
                        costPerImpressionUsdCents?: number;
                        createdAt?: string;
                        creatives?: ({
                            /** @enum {string} */
                            adFormat?: "banner" | "card" | "video" | "interstitial";
                            adStackId?: string | null;
                            /** @enum {string} */
                            adType?: "text" | "image" | "video";
                            bodyText?: string | null;
                            campaignId: string;
                            ctaText?: string | null;
                            destinationUrl: string;
                            headline?: string | null;
                            id: string;
                            imageSpecs?: ({
                                bytes?: number;
                                height?: number | null;
                                mimeType?: string;
                                preparation?: {
                                    [key: string]: unknown;
                                } | null;
                                renditions?: {
                                    [key: string]: unknown;
                                }[];
                                sha256?: string | null;
                                width?: number | null;
                            } & {
                                [key: string]: unknown;
                            }) | null;
                            imageUrl?: string | null;
                            mediaAssetId?: string | null;
                            /** @enum {string|null} */
                            mediaFormat?: "image" | "gif" | "video" | null;
                            posterUrl?: string | null;
                            rejectionReason?: string | null;
                            /** @enum {string} */
                            reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                            status?: string;
                            videoUrl?: string | null;
                        } & {
                            [key: string]: unknown;
                        })[];
                        currentSubmissionId?: string | null;
                        dailyBudgetUsd?: number | null;
                        dailyBudgetUsdCents?: number | null;
                        defaultStackId?: string;
                        description?: string | null;
                        endsAt?: string | null;
                        /** @enum {string} */
                        format: "banner" | "card" | "video" | "interstitial";
                        formats?: ("banner" | "card" | "video" | "interstitial")[];
                        frequencyCapPerDay?: number;
                        geoLocations?: {
                            [key: string]: unknown;
                        }[];
                        geoMode?: string;
                        hourlyPacingUsdCents?: number | null;
                        hoversCount?: number;
                        id: string;
                        impressionsCount?: number;
                        /** @enum {string} */
                        moderationStatus: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                        pricingModel?: string;
                        pricingVersion?: number;
                        rejectionReason?: string | null;
                        remainingBudgetUsd?: number;
                        remainingBudgetUsdCents: number;
                        schedule?: (({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        })) | null;
                        spentUsd?: number;
                        startsAt?: string | null;
                        /** @enum {string} */
                        status: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                        submissionIntentId?: string | null;
                        submissionRequestId?: string | null;
                        submissionState?: string | null;
                        submittedAt?: string | null;
                        targetCountries?: string | null;
                        targetDevices?: (string | string[]) | null;
                        targetHours?: (string | number[]) | null;
                        targetStates?: string | null;
                        title: string;
                        touchesCount?: number;
                        updatedAt?: string;
                    } & {
                        [key: string]: unknown;
                    };
                    decision: {
                        decision: string;
                        id: string;
                        reviewerId: string;
                        targetId: string;
                        /** @enum {string} */
                        targetType: "campaign" | "creative" | "stack";
                    } & {
                        [key: string]: unknown;
                    };
                    live: boolean;
                    nextStage: string;
                    stage: string;
                    targetId: string;
                    targetType: string;
                } & {
                    [key: string]: unknown;
                };
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Moderation_submissionDetailResponse: {
            data: {
                campaign: {
                    adStacks?: ({
                        campaignId: string;
                        creatives?: ({
                            /** @enum {string} */
                            adFormat?: "banner" | "card" | "video" | "interstitial";
                            adStackId?: string | null;
                            /** @enum {string} */
                            adType?: "text" | "image" | "video";
                            bodyText?: string | null;
                            campaignId: string;
                            ctaText?: string | null;
                            destinationUrl: string;
                            headline?: string | null;
                            id: string;
                            imageSpecs?: ({
                                bytes?: number;
                                height?: number | null;
                                mimeType?: string;
                                preparation?: {
                                    [key: string]: unknown;
                                } | null;
                                renditions?: {
                                    [key: string]: unknown;
                                }[];
                                sha256?: string | null;
                                width?: number | null;
                            } & {
                                [key: string]: unknown;
                            }) | null;
                            imageUrl?: string | null;
                            mediaAssetId?: string | null;
                            /** @enum {string|null} */
                            mediaFormat?: "image" | "gif" | "video" | null;
                            posterUrl?: string | null;
                            rejectionReason?: string | null;
                            /** @enum {string} */
                            reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                            status?: string;
                            videoUrl?: string | null;
                        } & {
                            [key: string]: unknown;
                        })[];
                        effectiveSettings?: {
                            /** @enum {string} */
                            geoMode?: "inherit" | "global" | "targeted";
                            locations?: {
                                [key: string]: unknown;
                            }[];
                            schedule?: ({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            });
                            targetDevices?: string[];
                            targetHours?: number[];
                        } & {
                            [key: string]: unknown;
                        };
                        geoMode?: string;
                        id: string;
                        name: string;
                        position?: number;
                        schedule?: (({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        })) | null;
                        settings?: {
                            /** @enum {string} */
                            geoMode?: "inherit" | "global" | "targeted";
                            locations?: {
                                [key: string]: unknown;
                            }[];
                            schedule?: ({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            });
                            targetDevices?: string[];
                            targetHours?: number[];
                        } & {
                            [key: string]: unknown;
                        };
                        targetDevices?: string | null;
                        targetHours?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    advertiserId?: string;
                    approvedRevision?: number | null;
                    approvedSubmissionId?: string | null;
                    budgetUsd?: number;
                    budgetUsdCents: number;
                    capabilities?: {
                        blocker: string | null;
                        canActivate: boolean;
                        canBeginEdit: boolean;
                        canEdit: boolean;
                        canPause: boolean;
                        canSubmit: boolean;
                        canTrash: boolean;
                    } & {
                        [key: string]: unknown;
                    };
                    category?: string | null;
                    channels?: string | null;
                    clicksCount?: number;
                    contentRevision?: number;
                    costPerClickUsdCents?: number;
                    costPerImpressionUsdCents?: number;
                    createdAt?: string;
                    creatives?: ({
                        /** @enum {string} */
                        adFormat?: "banner" | "card" | "video" | "interstitial";
                        adStackId?: string | null;
                        /** @enum {string} */
                        adType?: "text" | "image" | "video";
                        bodyText?: string | null;
                        campaignId: string;
                        ctaText?: string | null;
                        destinationUrl: string;
                        headline?: string | null;
                        id: string;
                        imageSpecs?: ({
                            bytes?: number;
                            height?: number | null;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number | null;
                        } & {
                            [key: string]: unknown;
                        }) | null;
                        imageUrl?: string | null;
                        mediaAssetId?: string | null;
                        /** @enum {string|null} */
                        mediaFormat?: "image" | "gif" | "video" | null;
                        posterUrl?: string | null;
                        rejectionReason?: string | null;
                        /** @enum {string} */
                        reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                        status?: string;
                        videoUrl?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    currentSubmissionId?: string | null;
                    dailyBudgetUsd?: number | null;
                    dailyBudgetUsdCents?: number | null;
                    defaultStackId?: string;
                    description?: string | null;
                    endsAt?: string | null;
                    /** @enum {string} */
                    format: "banner" | "card" | "video" | "interstitial";
                    formats?: ("banner" | "card" | "video" | "interstitial")[];
                    frequencyCapPerDay?: number;
                    geoLocations?: {
                        [key: string]: unknown;
                    }[];
                    geoMode?: string;
                    hourlyPacingUsdCents?: number | null;
                    hoversCount?: number;
                    id: string;
                    impressionsCount?: number;
                    /** @enum {string} */
                    moderationStatus: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                    pricingModel?: string;
                    pricingVersion?: number;
                    rejectionReason?: string | null;
                    remainingBudgetUsd?: number;
                    remainingBudgetUsdCents: number;
                    schedule?: (({
                        /** @enum {string} */
                        mode: "inherit";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    }) | ({
                        /** @enum {string} */
                        mode: "round_the_clock" | "custom";
                        ranges: ({
                            endMinute: number;
                            startMinute: number;
                        } & {
                            [key: string]: unknown;
                        })[];
                        /** @enum {string} */
                        timezone: "Africa/Lagos";
                        /** @enum {integer} */
                        version: 1;
                    } & {
                        [key: string]: unknown;
                    })) | null;
                    spentUsd?: number;
                    startsAt?: string | null;
                    /** @enum {string} */
                    status: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                    submissionIntentId?: string | null;
                    submissionRequestId?: string | null;
                    submissionState?: string | null;
                    submittedAt?: string | null;
                    targetCountries?: string | null;
                    targetDevices?: (string | string[]) | null;
                    targetHours?: (string | number[]) | null;
                    targetStates?: string | null;
                    title: string;
                    touchesCount?: number;
                    updatedAt?: string;
                } & {
                    [key: string]: unknown;
                };
                contentRevision: number;
                snapshot: {
                    campaign: {
                        adStacks?: ({
                            campaignId: string;
                            creatives?: ({
                                /** @enum {string} */
                                adFormat?: "banner" | "card" | "video" | "interstitial";
                                adStackId?: string | null;
                                /** @enum {string} */
                                adType?: "text" | "image" | "video";
                                bodyText?: string | null;
                                campaignId: string;
                                ctaText?: string | null;
                                destinationUrl: string;
                                headline?: string | null;
                                id: string;
                                imageSpecs?: ({
                                    bytes?: number;
                                    height?: number | null;
                                    mimeType?: string;
                                    preparation?: {
                                        [key: string]: unknown;
                                    } | null;
                                    renditions?: {
                                        [key: string]: unknown;
                                    }[];
                                    sha256?: string | null;
                                    width?: number | null;
                                } & {
                                    [key: string]: unknown;
                                }) | null;
                                imageUrl?: string | null;
                                mediaAssetId?: string | null;
                                /** @enum {string|null} */
                                mediaFormat?: "image" | "gif" | "video" | null;
                                posterUrl?: string | null;
                                rejectionReason?: string | null;
                                /** @enum {string} */
                                reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                                status?: string;
                                videoUrl?: string | null;
                            } & {
                                [key: string]: unknown;
                            })[];
                            effectiveSettings?: {
                                /** @enum {string} */
                                geoMode?: "inherit" | "global" | "targeted";
                                locations?: {
                                    [key: string]: unknown;
                                }[];
                                schedule?: ({
                                    /** @enum {string} */
                                    mode: "inherit";
                                    /** @enum {integer} */
                                    version: 1;
                                } & {
                                    [key: string]: unknown;
                                }) | ({
                                    /** @enum {string} */
                                    mode: "round_the_clock" | "custom";
                                    ranges: ({
                                        endMinute: number;
                                        startMinute: number;
                                    } & {
                                        [key: string]: unknown;
                                    })[];
                                    /** @enum {string} */
                                    timezone: "Africa/Lagos";
                                    /** @enum {integer} */
                                    version: 1;
                                } & {
                                    [key: string]: unknown;
                                });
                                targetDevices?: string[];
                                targetHours?: number[];
                            } & {
                                [key: string]: unknown;
                            };
                            geoMode?: string;
                            id: string;
                            name: string;
                            position?: number;
                            schedule?: (({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            })) | null;
                            settings?: {
                                /** @enum {string} */
                                geoMode?: "inherit" | "global" | "targeted";
                                locations?: {
                                    [key: string]: unknown;
                                }[];
                                schedule?: ({
                                    /** @enum {string} */
                                    mode: "inherit";
                                    /** @enum {integer} */
                                    version: 1;
                                } & {
                                    [key: string]: unknown;
                                }) | ({
                                    /** @enum {string} */
                                    mode: "round_the_clock" | "custom";
                                    ranges: ({
                                        endMinute: number;
                                        startMinute: number;
                                    } & {
                                        [key: string]: unknown;
                                    })[];
                                    /** @enum {string} */
                                    timezone: "Africa/Lagos";
                                    /** @enum {integer} */
                                    version: 1;
                                } & {
                                    [key: string]: unknown;
                                });
                                targetDevices?: string[];
                                targetHours?: number[];
                            } & {
                                [key: string]: unknown;
                            };
                            targetDevices?: string | null;
                            targetHours?: string | null;
                        } & {
                            [key: string]: unknown;
                        })[];
                        advertiserId?: string;
                        approvedRevision?: number | null;
                        approvedSubmissionId?: string | null;
                        budgetUsd?: number;
                        budgetUsdCents: number;
                        capabilities?: {
                            blocker: string | null;
                            canActivate: boolean;
                            canBeginEdit: boolean;
                            canEdit: boolean;
                            canPause: boolean;
                            canSubmit: boolean;
                            canTrash: boolean;
                        } & {
                            [key: string]: unknown;
                        };
                        category?: string | null;
                        channels?: string | null;
                        clicksCount?: number;
                        contentRevision?: number;
                        costPerClickUsdCents?: number;
                        costPerImpressionUsdCents?: number;
                        createdAt?: string;
                        creatives?: ({
                            /** @enum {string} */
                            adFormat?: "banner" | "card" | "video" | "interstitial";
                            adStackId?: string | null;
                            /** @enum {string} */
                            adType?: "text" | "image" | "video";
                            bodyText?: string | null;
                            campaignId: string;
                            ctaText?: string | null;
                            destinationUrl: string;
                            headline?: string | null;
                            id: string;
                            imageSpecs?: ({
                                bytes?: number;
                                height?: number | null;
                                mimeType?: string;
                                preparation?: {
                                    [key: string]: unknown;
                                } | null;
                                renditions?: {
                                    [key: string]: unknown;
                                }[];
                                sha256?: string | null;
                                width?: number | null;
                            } & {
                                [key: string]: unknown;
                            }) | null;
                            imageUrl?: string | null;
                            mediaAssetId?: string | null;
                            /** @enum {string|null} */
                            mediaFormat?: "image" | "gif" | "video" | null;
                            posterUrl?: string | null;
                            rejectionReason?: string | null;
                            /** @enum {string} */
                            reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                            status?: string;
                            videoUrl?: string | null;
                        } & {
                            [key: string]: unknown;
                        })[];
                        currentSubmissionId?: string | null;
                        dailyBudgetUsd?: number | null;
                        dailyBudgetUsdCents?: number | null;
                        defaultStackId?: string;
                        description?: string | null;
                        endsAt?: string | null;
                        /** @enum {string} */
                        format: "banner" | "card" | "video" | "interstitial";
                        formats?: ("banner" | "card" | "video" | "interstitial")[];
                        frequencyCapPerDay?: number;
                        geoLocations?: {
                            [key: string]: unknown;
                        }[];
                        geoMode?: string;
                        hourlyPacingUsdCents?: number | null;
                        hoversCount?: number;
                        id: string;
                        impressionsCount?: number;
                        /** @enum {string} */
                        moderationStatus: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                        pricingModel?: string;
                        pricingVersion?: number;
                        rejectionReason?: string | null;
                        remainingBudgetUsd?: number;
                        remainingBudgetUsdCents: number;
                        schedule?: (({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        })) | null;
                        spentUsd?: number;
                        startsAt?: string | null;
                        /** @enum {string} */
                        status: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                        submissionIntentId?: string | null;
                        submissionRequestId?: string | null;
                        submissionState?: string | null;
                        submittedAt?: string | null;
                        targetCountries?: string | null;
                        targetDevices?: (string | string[]) | null;
                        targetHours?: (string | number[]) | null;
                        targetStates?: string | null;
                        title: string;
                        touchesCount?: number;
                        updatedAt?: string;
                    } & {
                        [key: string]: unknown;
                    };
                    creatives: ({
                        /** @enum {string} */
                        adFormat?: "banner" | "card" | "video" | "interstitial";
                        adStackId?: string | null;
                        /** @enum {string} */
                        adType?: "text" | "image" | "video";
                        bodyText?: string | null;
                        campaignId: string;
                        ctaText?: string | null;
                        destinationUrl: string;
                        headline?: string | null;
                        id: string;
                        imageSpecs?: ({
                            bytes?: number;
                            height?: number | null;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number | null;
                        } & {
                            [key: string]: unknown;
                        }) | null;
                        imageUrl?: string | null;
                        mediaAssetId?: string | null;
                        /** @enum {string|null} */
                        mediaFormat?: "image" | "gif" | "video" | null;
                        posterUrl?: string | null;
                        rejectionReason?: string | null;
                        /** @enum {string} */
                        reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                        status?: string;
                        videoUrl?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    stacks: ({
                        campaignId: string;
                        creatives?: ({
                            /** @enum {string} */
                            adFormat?: "banner" | "card" | "video" | "interstitial";
                            adStackId?: string | null;
                            /** @enum {string} */
                            adType?: "text" | "image" | "video";
                            bodyText?: string | null;
                            campaignId: string;
                            ctaText?: string | null;
                            destinationUrl: string;
                            headline?: string | null;
                            id: string;
                            imageSpecs?: ({
                                bytes?: number;
                                height?: number | null;
                                mimeType?: string;
                                preparation?: {
                                    [key: string]: unknown;
                                } | null;
                                renditions?: {
                                    [key: string]: unknown;
                                }[];
                                sha256?: string | null;
                                width?: number | null;
                            } & {
                                [key: string]: unknown;
                            }) | null;
                            imageUrl?: string | null;
                            mediaAssetId?: string | null;
                            /** @enum {string|null} */
                            mediaFormat?: "image" | "gif" | "video" | null;
                            posterUrl?: string | null;
                            rejectionReason?: string | null;
                            /** @enum {string} */
                            reviewStatus?: "pending" | "pending_manager_approval" | "approved" | "rejected";
                            status?: string;
                            videoUrl?: string | null;
                        } & {
                            [key: string]: unknown;
                        })[];
                        effectiveSettings?: {
                            /** @enum {string} */
                            geoMode?: "inherit" | "global" | "targeted";
                            locations?: {
                                [key: string]: unknown;
                            }[];
                            schedule?: ({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            });
                            targetDevices?: string[];
                            targetHours?: number[];
                        } & {
                            [key: string]: unknown;
                        };
                        geoMode?: string;
                        id: string;
                        name: string;
                        position?: number;
                        schedule?: (({
                            /** @enum {string} */
                            mode: "inherit";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        }) | ({
                            /** @enum {string} */
                            mode: "round_the_clock" | "custom";
                            ranges: ({
                                endMinute: number;
                                startMinute: number;
                            } & {
                                [key: string]: unknown;
                            })[];
                            /** @enum {string} */
                            timezone: "Africa/Lagos";
                            /** @enum {integer} */
                            version: 1;
                        } & {
                            [key: string]: unknown;
                        })) | null;
                        settings?: {
                            /** @enum {string} */
                            geoMode?: "inherit" | "global" | "targeted";
                            locations?: {
                                [key: string]: unknown;
                            }[];
                            schedule?: ({
                                /** @enum {string} */
                                mode: "inherit";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            }) | ({
                                /** @enum {string} */
                                mode: "round_the_clock" | "custom";
                                ranges: ({
                                    endMinute: number;
                                    startMinute: number;
                                } & {
                                    [key: string]: unknown;
                                })[];
                                /** @enum {string} */
                                timezone: "Africa/Lagos";
                                /** @enum {integer} */
                                version: 1;
                            } & {
                                [key: string]: unknown;
                            });
                            targetDevices?: string[];
                            targetHours?: number[];
                        } & {
                            [key: string]: unknown;
                        };
                        targetDevices?: string | null;
                        targetHours?: string | null;
                    } & {
                        [key: string]: unknown;
                    })[];
                    targets: {
                        [key: string]: unknown;
                    }[];
                } & {
                    [key: string]: unknown;
                };
                submissionId: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Moderation_suspendPromoterResponse: {
            data: {
                id: string;
                isSuspended: boolean;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        MutationDto: {
            expectedRevision: number;
            /** Format: uuid */
            requestId: string;
        };
        PresignUploadDto: {
            contentLength: number;
            contentType: string;
            fileName: string;
            sha256?: string | null;
        };
        PublisherInventory_checkSlotInstallationResponse: {
            data: {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        PublisherInventory_createSetupCheckResponse: {
            data: {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        PublisherInventory_createSlotResponse: {
            data: {
                id: string;
                name: string;
                slotTagId: string;
                /** @enum {string} */
                slotType: "network" | "consideration" | "direct" | "hybrid";
                websiteId: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        PublisherInventory_getSetupCheckResponse: {
            data: {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        PublisherInventory_getSlotDiagnosticsResponse: {
            data: {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        PublisherInventory_getSlotEmbedResponse: {
            data: {
                htmlSnippet: string;
                nextJsSnippet: string;
                sdkSnippet: string;
                slotSnippet: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        PublisherInventory_getSlotsResponse: {
            data: ({
                id: string;
                name: string;
                slotTagId: string;
                /** @enum {string} */
                slotType: "network" | "consideration" | "direct" | "hybrid";
                websiteId: string;
            } & {
                [key: string]: unknown;
            })[];
            /** @enum {string} */
            status: "success";
        };
        ReplaceCreativeDto: {
            /** @enum {string|null} */
            adFormat?: "banner" | "card" | "video" | "interstitial" | null;
            /** Format: uuid */
            adStackId?: string | null;
            /** @enum {string|null} */
            adType?: "text" | "image" | "video" | null;
            bodyText?: string | null;
            ctaText?: string | null;
            destinationUrl?: string | null;
            expectedRevision: number;
            headline?: string | null;
            imageUrl?: string | null;
            /** Format: uuid */
            mediaAssetId?: string | null;
            /** @enum {string|null} */
            mediaFormat?: "image" | "gif" | "video" | null;
            /** Format: uuid */
            requestId: string;
            videoUrl?: string | null;
        };
        ReviewDecisionDto: {
            advertiserNote?: string | null;
            /** @enum {string} */
            decision: "approved" | "rejected";
            expectedRevision: number;
            internalNote?: string | null;
            note?: string | null;
            reasonCode?: string | null;
            /** Format: uuid */
            requestId: string;
            /** Format: uuid */
            submissionId: string;
        };
        SaveCampaignDto: {
            budgetUsd?: number | null;
            category?: string | null;
            channels?: ("websites" | "individuals" | "mobile_apps")[] | null;
            costPerClickCents?: number | null;
            costPerImpressionCents?: number | null;
            dailyBudgetUsd?: number | null;
            description?: string | null;
            expectedRevision: number;
            /** @enum {string|null} */
            format?: "banner" | "card" | "video" | "interstitial" | null;
            frequencyCapPerDay?: number | null;
            /** @enum {string|null} */
            geoMode?: "global" | "targeted" | null;
            locations?: string[] | null;
            /** @enum {string|null} */
            pricingModel?: "cpm" | "cpc" | null;
            /** Format: uuid */
            requestId: string;
            schedule?: (({
                /** @enum {string} */
                mode: "inherit";
                /** @enum {integer} */
                version: 1;
            } & {
                [key: string]: unknown;
            }) | ({
                /** @enum {string} */
                mode: "round_the_clock" | "custom";
                ranges: ({
                    endMinute: number;
                    startMinute: number;
                } & {
                    [key: string]: unknown;
                })[];
                /** @enum {string} */
                timezone: "Africa/Lagos";
                /** @enum {integer} */
                version: 1;
            } & {
                [key: string]: unknown;
            })) | null;
            stacks?: ({
                ads: ({
                    /** @enum {string} */
                    adFormat?: "banner" | "card" | "video" | "interstitial";
                    /** @enum {string} */
                    adType: "text" | "image" | "video";
                    bodyText?: string;
                    ctaText?: string;
                    destinationUrl: string;
                    headline?: string;
                    /** Format: uuid */
                    id?: string;
                    /** Format: uuid */
                    mediaAssetId?: string;
                } & {
                    [key: string]: unknown;
                })[];
                /** @enum {string} */
                geoMode?: "inherit" | "global" | "targeted";
                /** Format: uuid */
                id?: string;
                locations?: string[];
                name: string;
                schedule?: ({
                    /** @enum {string} */
                    mode: "inherit";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                }) | ({
                    /** @enum {string} */
                    mode: "round_the_clock" | "custom";
                    ranges: ({
                        endMinute: number;
                        startMinute: number;
                    } & {
                        [key: string]: unknown;
                    })[];
                    /** @enum {string} */
                    timezone: "Africa/Lagos";
                    /** @enum {integer} */
                    version: 1;
                } & {
                    [key: string]: unknown;
                });
                targetDevices?: string[];
            } & {
                [key: string]: unknown;
            })[] | null;
            targetDevices?: string[] | null;
            title?: string | null;
        };
        SuspendPromoterDto: {
            reason?: string | null;
            suspend: boolean;
        };
        UpdateStackDto: {
            expectedRevision: number;
            /** @enum {string|null} */
            geoMode?: "inherit" | "global" | "targeted" | null;
            locations?: string[] | null;
            name?: string | null;
            /** Format: uuid */
            requestId: string;
            schedule?: (({
                /** @enum {string} */
                mode: "inherit";
                /** @enum {integer} */
                version: 1;
            } & {
                [key: string]: unknown;
            }) | ({
                /** @enum {string} */
                mode: "round_the_clock" | "custom";
                ranges: ({
                    endMinute: number;
                    startMinute: number;
                } & {
                    [key: string]: unknown;
                })[];
                /** @enum {string} */
                timezone: "Africa/Lagos";
                /** @enum {integer} */
                version: 1;
            } & {
                [key: string]: unknown;
            })) | null;
            targetDevices?: string[] | null;
            targetHours?: number[] | null;
        };
        Uploads_completeResponse: {
            data: {
                bytes?: number;
                cdnUrl?: string | null;
                id: string;
                mimeType?: string;
                ownerId?: string;
                status: string;
                storageKey?: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Uploads_getSettingsResponse: {
            data: {
                allowedMimes: {
                    images: string[];
                    videos: string[];
                } & {
                    [key: string]: unknown;
                };
                formatCompatibility: {
                    [key: string]: unknown;
                };
                limits: {
                    imageMaxBytes: number;
                    videoMaxBytes: number;
                } & {
                    [key: string]: unknown;
                };
                processing: {
                    [key: string]: unknown;
                };
                storage: {
                    [key: string]: unknown;
                };
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Uploads_presignResponse: {
            data: {
                assetId: string;
                cdnUrl: string;
                expiresAt: string;
                storageKey: string;
                uploadUrl: string;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
        Uploads_uploadDirectResponse: {
            data: {
                assetId: string;
                bytes?: number;
                cdnUrl: string | null;
                height?: number | null;
                mimeType?: string;
                preparation?: {
                    [key: string]: unknown;
                } | null;
                sha256?: string | null;
                status: string;
                storageKey?: string;
                width?: number | null;
            } & {
                [key: string]: unknown;
            };
            /** @enum {string} */
            status: "success";
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    AdsOperations_listAuctionDecisions: {
        parameters: {
            query: {
                limit: number;
                page: number;
                pageSize: number;
                slotTagId: string;
                requestId: string;
                search: string;
                inventoryClass: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_listAuctionDecisionsResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_getAuctionDecision: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                requestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_getAuctionDecisionResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_changeAudit: {
        parameters: {
            query?: {
                offset?: number;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_changeAuditResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_reviewCampaign: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReviewDecisionDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_primaryReviewCampaignResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_emergencyOverride: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EmergencyOverrideDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_primaryReviewCampaignResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_managerApprovalCampaign: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReviewDecisionDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_primaryReviewCampaignResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_primaryReviewCampaign: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReviewDecisionDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_primaryReviewCampaignResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_reviewReceipt: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                requestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_reviewReceiptResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_submissionDetail: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_submissionDetailResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_reviewCreative: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReviewDecisionDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_reviewCreativeResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_managerApprovalCreative: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReviewDecisionDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_primaryReviewCreativeResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_primaryReviewCreative: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReviewDecisionDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_primaryReviewCreativeResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_itemDetail: {
        parameters: {
            query?: {
                page?: number;
            };
            header?: never;
            path: {
                targetType: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_itemDetailResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_getClaim: {
        parameters: {
            query?: {
                stage?: "reviewer" | "manager";
            };
            header?: never;
            path: {
                targetType: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_getClaimResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_acquireClaim: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                targetType: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ModerationClaimDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_acquireClaimResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_releaseClaim: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                targetType: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ModerationClaimDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_acquireClaimResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_renewClaim: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                targetType: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ModerationClaimDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_acquireClaimResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_takeoverClaim: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                targetType: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ModerationClaimDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_acquireClaimResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_operationsSummary: {
        parameters: {
            query?: {
                targetType?: "all" | "creative" | "stack" | "campaign";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_operationsSummaryResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_suspendPromoter: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SuspendPromoterDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_suspendPromoterResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_getQueue: {
        parameters: {
            query?: {
                stage?: "reviewer" | "manager";
                page?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_getQueueResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_managerApprovalStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReviewDecisionDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_primaryReviewStackResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Moderation_primaryReviewStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReviewDecisionDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Moderation_primaryReviewStackResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_adminCheckSlotInstallation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_adminCheckSlotInstallationResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_adminUpdateSlotLifecycle: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_adminUpdateSlotLifecycleResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_adminListWebsites: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                search?: string;
                policyStatus?: string;
                verificationStatus?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_adminListWebsitesResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_adminGetWebsite: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                websiteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_adminGetWebsiteResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_reviewWebsitePolicy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                websiteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_reviewWebsitePolicyResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_reinstateWebsite: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                websiteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_reinstateWebsiteResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_suspendWebsite: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                websiteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_suspendWebsiteResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_listAuctionDecisions_legacy: {
        parameters: {
            query: {
                limit: number;
                page: number;
                pageSize: number;
                slotTagId: string;
                requestId: string;
                search: string;
                inventoryClass: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_listAuctionDecisionsResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_getAuctionDecision_legacy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                requestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_getAuctionDecisionResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_adminCheckSlotInstallation_legacy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_adminCheckSlotInstallationResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_adminUpdateSlotLifecycle_legacy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_adminUpdateSlotLifecycleResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_adminListWebsites_legacy: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                search?: string;
                policyStatus?: string;
                verificationStatus?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_adminListWebsitesResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_adminGetWebsite_legacy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                websiteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_adminGetWebsiteResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_reviewWebsitePolicy_legacy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                websiteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_reviewWebsitePolicyResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_reinstateWebsite_legacy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                websiteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_reinstateWebsiteResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    AdsOperations_suspendWebsite_legacy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                websiteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsOperations_suspendWebsiteResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_getAdvertiserCampaigns: {
        parameters: {
            query?: {
                status?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_getAdvertiserCampaignsResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_createCampaign: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCampaignDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_createCampaignResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_staffCampaignPage: {
        parameters: {
            query?: {
                page?: number;
                pageSize?: number;
                search?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_staffCampaignPageResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_staffDeliveryReadiness: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_staffDeliveryReadinessResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_getCatalog: {
        parameters: {
            query?: {
                category?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_getCatalogResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_getCreationCapabilities: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_getCreationCapabilitiesResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_findCreationRequest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                requestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_findCreationRequestResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_replaceCreative: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReplaceCreativeDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_addCreativeResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_campaignPage: {
        parameters: {
            query?: {
                status?: string;
                page?: number;
                pageSize?: number;
                search?: string;
                sort?: "newest" | "oldest" | "title";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_campaignPageResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_getCampaignDetails: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_getCampaignDetailsResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_saveCampaign: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveCampaignDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_saveCampaignResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_createStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateStackDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_createStackResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_deleteStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                stackId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MutationDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_deleteStackResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_updateStack: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                stackId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateStackDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_createStackResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_beginEdit: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BeginEditDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_beginEditResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_addCreative: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddCreativeDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_addCreativeResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_deleteCreative: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                creativeId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MutationDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_deleteCreativeResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_deliveryReadiness: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_staffDeliveryReadinessResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_mutationResult: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                requestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_mutationResultResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_updateStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @enum {string} */
                    status: "active" | "paused" | "trash" | "draft";
                } & {
                    [key: string]: unknown;
                };
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_createCampaignResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Campaigns_submitForReview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MutationDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Campaigns_createCampaignResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    PublisherInventory_getSetupCheck: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                checkId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublisherInventory_getSetupCheckResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    PublisherInventory_createSlot: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSlotDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublisherInventory_createSlotResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    PublisherInventory_updateSlot: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slotId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublisherInventory_createSlotResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    PublisherInventory_checkSlotInstallation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slotId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublisherInventory_checkSlotInstallationResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    PublisherInventory_getSlotDiagnostics: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slotId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublisherInventory_getSlotDiagnosticsResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    PublisherInventory_getSlotEmbed: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slotId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublisherInventory_getSlotEmbedResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    PublisherInventory_createSetupCheck: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                websiteId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSetupCheckDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublisherInventory_createSetupCheckResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    PublisherInventory_getSlots: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                websiteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublisherInventory_getSlotsResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Uploads_readyAsset: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                assetId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Uploads_uploadDirectResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Uploads_uploadDirect: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    file: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Uploads_uploadDirectResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Uploads_getMedia: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                storageKey: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Binary media stream */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": string;
                };
            };
            /** @description Binary media stream */
            206: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": string;
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Unsatisfiable byte range */
            416: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Uploads_uploadPrepared: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    files: string[];
                    manifest: string;
                } & {
                    [key: string]: unknown;
                };
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Uploads_uploadDirectResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Uploads_presign: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PresignUploadDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Uploads_presignResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Uploads_previewMedia: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                storageKey: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Binary media stream */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": string;
                };
            };
            /** @description Binary media stream */
            206: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": string;
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Unsatisfiable byte range */
            416: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Uploads_reviewMedia: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                storageKey: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Binary media stream */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": string;
                };
            };
            /** @description Binary media stream */
            206: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": string;
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Unsatisfiable byte range */
            416: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Uploads_getSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Uploads_getSettingsResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Uploads_deleteAsset: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                assetId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Uploads_completeResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
    Uploads_complete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                assetId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CompleteUploadDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Uploads_completeResponse"];
                };
            };
            /** @description Sanitized API error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
            /** @description Sanitized API error */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdsApiError"];
                };
            };
        };
    };
}
