export interface paths {
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
                    height?: number;
                    mimeType?: string;
                    preparation?: {
                        [key: string]: unknown;
                    } | null;
                    renditions?: {
                        [key: string]: unknown;
                    }[];
                    sha256?: string | null;
                    width?: number;
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
                reviewStatus?: "pending" | "approved" | "rejected";
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
                            height?: number;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number;
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
                        reviewStatus?: "pending" | "approved" | "rejected";
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
                        height?: number;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number;
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
                    reviewStatus?: "pending" | "approved" | "rejected";
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
                                height?: number;
                                mimeType?: string;
                                preparation?: {
                                    [key: string]: unknown;
                                } | null;
                                renditions?: {
                                    [key: string]: unknown;
                                }[];
                                sha256?: string | null;
                                width?: number;
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
                            reviewStatus?: "pending" | "approved" | "rejected";
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
                            height?: number;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number;
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
                        reviewStatus?: "pending" | "approved" | "rejected";
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
                            height?: number;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number;
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
                        reviewStatus?: "pending" | "approved" | "rejected";
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
                        height?: number;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number;
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
                    reviewStatus?: "pending" | "approved" | "rejected";
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
                        height?: number;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number;
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
                    reviewStatus?: "pending" | "approved" | "rejected";
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
                            height?: number;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number;
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
                        reviewStatus?: "pending" | "approved" | "rejected";
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
                        height?: number;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number;
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
                    reviewStatus?: "pending" | "approved" | "rejected";
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
                            height?: number;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number;
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
                        reviewStatus?: "pending" | "approved" | "rejected";
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
                        height?: number;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number;
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
                    reviewStatus?: "pending" | "approved" | "rejected";
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
                            height?: number;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number;
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
                        reviewStatus?: "pending" | "approved" | "rejected";
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
                        height?: number;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number;
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
                    reviewStatus?: "pending" | "approved" | "rejected";
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
                            height?: number;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number;
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
                        reviewStatus?: "pending" | "approved" | "rejected";
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
                        height?: number;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number;
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
                    reviewStatus?: "pending" | "approved" | "rejected";
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
        Moderation_getQueueResponse: {
            data: {
                campaigns: ({
                    advertiserId: string;
                    budgetUsdCents: number;
                    contentRevision: number;
                    createdAt: string;
                    id: string;
                    /** @enum {string} */
                    moderationStatus: "draft" | "pending_primary_review" | "pending_manager_approval" | "approved" | "rejected";
                    pricingModel: string;
                    /** @enum {string} */
                    status: "draft" | "active" | "paused" | "completed" | "cancelled" | "under_review" | "pending_manager_approval" | "rejected" | "suspended" | "trash";
                    submissionId: string;
                    title: string;
                } & {
                    [key: string]: unknown;
                })[];
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
                        height?: number;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number;
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
                    reviewStatus?: "pending" | "approved" | "rejected";
                    status?: string;
                    submissionId: string;
                    videoUrl?: string | null;
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
                                height?: number;
                                mimeType?: string;
                                preparation?: {
                                    [key: string]: unknown;
                                } | null;
                                renditions?: {
                                    [key: string]: unknown;
                                }[];
                                sha256?: string | null;
                                width?: number;
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
                            reviewStatus?: "pending" | "approved" | "rejected";
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
                            height?: number;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number;
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
                        reviewStatus?: "pending" | "approved" | "rejected";
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
                    targetType: "campaign" | "creative";
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
                        height?: number;
                        mimeType?: string;
                        preparation?: {
                            [key: string]: unknown;
                        } | null;
                        renditions?: {
                            [key: string]: unknown;
                        }[];
                        sha256?: string | null;
                        width?: number;
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
                    reviewStatus?: "pending" | "approved" | "rejected";
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
                    targetType: "campaign" | "creative";
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
                                height?: number;
                                mimeType?: string;
                                preparation?: {
                                    [key: string]: unknown;
                                } | null;
                                renditions?: {
                                    [key: string]: unknown;
                                }[];
                                sha256?: string | null;
                                width?: number;
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
                            reviewStatus?: "pending" | "approved" | "rejected";
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
                            height?: number;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number;
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
                        reviewStatus?: "pending" | "approved" | "rejected";
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
                                    height?: number;
                                    mimeType?: string;
                                    preparation?: {
                                        [key: string]: unknown;
                                    } | null;
                                    renditions?: {
                                        [key: string]: unknown;
                                    }[];
                                    sha256?: string | null;
                                    width?: number;
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
                                reviewStatus?: "pending" | "approved" | "rejected";
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
                                height?: number;
                                mimeType?: string;
                                preparation?: {
                                    [key: string]: unknown;
                                } | null;
                                renditions?: {
                                    [key: string]: unknown;
                                }[];
                                sha256?: string | null;
                                width?: number;
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
                            reviewStatus?: "pending" | "approved" | "rejected";
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
                            height?: number;
                            mimeType?: string;
                            preparation?: {
                                [key: string]: unknown;
                            } | null;
                            renditions?: {
                                [key: string]: unknown;
                            }[];
                            sha256?: string | null;
                            width?: number;
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
                        reviewStatus?: "pending" | "approved" | "rejected";
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
                                height?: number;
                                mimeType?: string;
                                preparation?: {
                                    [key: string]: unknown;
                                } | null;
                                renditions?: {
                                    [key: string]: unknown;
                                }[];
                                sha256?: string | null;
                                width?: number;
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
                            reviewStatus?: "pending" | "approved" | "rejected";
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
            /** @enum {string} */
            decision: "approved" | "rejected";
            expectedRevision: number;
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
                    status: "active" | "paused" | "trash";
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
