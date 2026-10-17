
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.4.1
 * Query Engine version: a9055b89e58b4b5bfb59600785423b1db3d0e75d
 */
Prisma.prismaVersion = {
  client: "6.4.1",
  engine: "a9055b89e58b4b5bfb59600785423b1db3d0e75d"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  hashedPassword: 'hashedPassword',
  role: 'role',
  active: 'active',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  sessionToken: 'sessionToken',
  userId: 'userId',
  expires: 'expires'
};

exports.Prisma.SiteSettingsScalarFieldEnum = {
  id: 'id',
  logoLight: 'logoLight',
  logoDark: 'logoDark',
  phoneNumbers: 'phoneNumbers',
  email: 'email',
  telegramLink: 'telegramLink',
  facebookLink: 'facebookLink',
  websiteUrl: 'websiteUrl',
  addressEn: 'addressEn',
  addressKm: 'addressKm',
  seoTitleEn: 'seoTitleEn',
  seoTitleKm: 'seoTitleKm',
  seoDescriptionEn: 'seoDescriptionEn',
  seoDescriptionKm: 'seoDescriptionKm',
  ogImage: 'ogImage',
  googleAnalyticsId: 'googleAnalyticsId',
  facebookPixelId: 'facebookPixelId',
  cookieNoticeTextEn: 'cookieNoticeTextEn',
  cookieNoticeTextKm: 'cookieNoticeTextKm',
  footerTextEn: 'footerTextEn',
  footerTextKm: 'footerTextKm',
  updatedAt: 'updatedAt'
};

exports.Prisma.AnnouncementBarScalarFieldEnum = {
  id: 'id',
  textEn: 'textEn',
  textKm: 'textKm',
  link: 'link',
  isActive: 'isActive',
  startDate: 'startDate',
  endDate: 'endDate',
  updatedAt: 'updatedAt'
};

exports.Prisma.HomeSectionScalarFieldEnum = {
  id: 'id',
  sectionKey: 'sectionKey',
  headlineEn: 'headlineEn',
  headlineKm: 'headlineKm',
  subHeadlineEn: 'subHeadlineEn',
  subHeadlineKm: 'subHeadlineKm',
  bodyEn: 'bodyEn',
  bodyKm: 'bodyKm',
  buttonLabelEn: 'buttonLabelEn',
  buttonLabelKm: 'buttonLabelKm',
  buttonLink: 'buttonLink',
  button2LabelEn: 'button2LabelEn',
  button2LabelKm: 'button2LabelKm',
  button2Link: 'button2Link',
  image: 'image',
  videoUrl: 'videoUrl',
  isVisible: 'isVisible',
  sortOrder: 'sortOrder',
  extraData: 'extraData',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  nameEn: 'nameEn',
  nameKm: 'nameKm',
  slug: 'slug',
  image: 'image',
  imageAltEn: 'imageAltEn',
  imageAltKm: 'imageAltKm',
  isVisible: 'isVisible',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  nameEn: 'nameEn',
  nameKm: 'nameKm',
  slug: 'slug',
  descriptionEn: 'descriptionEn',
  descriptionKm: 'descriptionKm',
  price: 'price',
  categoryId: 'categoryId',
  badges: 'badges',
  availability: 'availability',
  channelTags: 'channelTags',
  isFeatured: 'isFeatured',
  sortOrder: 'sortOrder',
  status: 'status',
  publishedAt: 'publishedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductImageScalarFieldEnum = {
  id: 'id',
  url: 'url',
  altEn: 'altEn',
  altKm: 'altKm',
  sortOrder: 'sortOrder',
  productId: 'productId'
};

exports.Prisma.PromotionScalarFieldEnum = {
  id: 'id',
  titleEn: 'titleEn',
  titleKm: 'titleKm',
  badgeTextEn: 'badgeTextEn',
  badgeTextKm: 'badgeTextKm',
  descriptionEn: 'descriptionEn',
  descriptionKm: 'descriptionKm',
  image: 'image',
  imageAltEn: 'imageAltEn',
  imageAltKm: 'imageAltKm',
  startDate: 'startDate',
  endDate: 'endDate',
  dailyStartTime: 'dailyStartTime',
  dailyEndTime: 'dailyEndTime',
  finePrintEn: 'finePrintEn',
  finePrintKm: 'finePrintKm',
  showOnHome: 'showOnHome',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PromotionProductScalarFieldEnum = {
  id: 'id',
  promotionId: 'promotionId',
  productId: 'productId'
};

exports.Prisma.WholesaleSettingsScalarFieldEnum = {
  id: 'id',
  heroHeadlineEn: 'heroHeadlineEn',
  heroHeadlineKm: 'heroHeadlineKm',
  heroSubHeadlineEn: 'heroSubHeadlineEn',
  heroSubHeadlineKm: 'heroSubHeadlineKm',
  heroImage: 'heroImage',
  deliveryCoverageEn: 'deliveryCoverageEn',
  deliveryCoverageKm: 'deliveryCoverageKm',
  minimumOrderTextEn: 'minimumOrderTextEn',
  minimumOrderTextKm: 'minimumOrderTextKm',
  updatedAt: 'updatedAt'
};

exports.Prisma.WholesaleStepScalarFieldEnum = {
  id: 'id',
  titleEn: 'titleEn',
  titleKm: 'titleKm',
  descriptionEn: 'descriptionEn',
  descriptionKm: 'descriptionKm',
  icon: 'icon',
  sortOrder: 'sortOrder'
};

exports.Prisma.FaqItemScalarFieldEnum = {
  id: 'id',
  questionEn: 'questionEn',
  questionKm: 'questionKm',
  answerEn: 'answerEn',
  answerKm: 'answerKm',
  section: 'section',
  sortOrder: 'sortOrder',
  isVisible: 'isVisible'
};

exports.Prisma.LocationScalarFieldEnum = {
  id: 'id',
  nameEn: 'nameEn',
  nameKm: 'nameKm',
  addressEn: 'addressEn',
  addressKm: 'addressKm',
  hoursEn: 'hoursEn',
  hoursKm: 'hoursKm',
  image: 'image',
  imageAltEn: 'imageAltEn',
  imageAltKm: 'imageAltKm',
  mapEmbedUrl: 'mapEmbedUrl',
  directionsLink: 'directionsLink',
  services: 'services',
  sortOrder: 'sortOrder',
  isVisible: 'isVisible',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StoryBlockScalarFieldEnum = {
  id: 'id',
  headingEn: 'headingEn',
  headingKm: 'headingKm',
  textEn: 'textEn',
  textKm: 'textKm',
  image: 'image',
  imageAltEn: 'imageAltEn',
  imageAltKm: 'imageAltKm',
  layout: 'layout',
  sortOrder: 'sortOrder',
  isVisible: 'isVisible'
};

exports.Prisma.GalleryItemScalarFieldEnum = {
  id: 'id',
  type: 'type',
  url: 'url',
  captionEn: 'captionEn',
  captionKm: 'captionKm',
  altEn: 'altEn',
  altKm: 'altKm',
  showOnHome: 'showOnHome',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt'
};

exports.Prisma.TestimonialScalarFieldEnum = {
  id: 'id',
  name: 'name',
  textEn: 'textEn',
  textKm: 'textKm',
  rating: 'rating',
  photo: 'photo',
  isVisible: 'isVisible',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt'
};

exports.Prisma.FormSubmissionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  phone: 'phone',
  email: 'email',
  type: 'type',
  message: 'message',
  status: 'status',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PageSeoScalarFieldEnum = {
  id: 'id',
  pageSlug: 'pageSlug',
  titleEn: 'titleEn',
  titleKm: 'titleKm',
  descriptionEn: 'descriptionEn',
  descriptionKm: 'descriptionKm',
  ogImage: 'ogImage'
};

exports.Prisma.MediaFileScalarFieldEnum = {
  id: 'id',
  url: 'url',
  publicId: 'publicId',
  filename: 'filename',
  altEn: 'altEn',
  altKm: 'altKm',
  mimeType: 'mimeType',
  width: 'width',
  height: 'height',
  size: 'size',
  createdAt: 'createdAt'
};

exports.Prisma.ActivityLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  entity: 'entity',
  entityId: 'entityId',
  details: 'details',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Role = exports.$Enums.Role = {
  OWNER: 'OWNER',
  EDITOR: 'EDITOR'
};

exports.Availability = exports.$Enums.Availability = {
  AVAILABLE: 'AVAILABLE',
  SOLD_OUT: 'SOLD_OUT',
  HIDDEN: 'HIDDEN'
};

exports.ContentStatus = exports.$Enums.ContentStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  SCHEDULED: 'SCHEDULED',
  TRASHED: 'TRASHED'
};

exports.ProductBadge = exports.$Enums.ProductBadge = {
  NEW: 'NEW',
  BEST_SELLER: 'BEST_SELLER',
  SEASONAL: 'SEASONAL',
  FEATURED: 'FEATURED'
};

exports.ChannelTag = exports.$Enums.ChannelTag = {
  RETAIL: 'RETAIL',
  WHOLESALE: 'WHOLESALE',
  FROZEN: 'FROZEN'
};

exports.StoryLayout = exports.$Enums.StoryLayout = {
  IMAGE_LEFT: 'IMAGE_LEFT',
  IMAGE_RIGHT: 'IMAGE_RIGHT',
  FULL_WIDTH: 'FULL_WIDTH'
};

exports.GalleryType = exports.$Enums.GalleryType = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO'
};

exports.SubmissionType = exports.$Enums.SubmissionType = {
  RETAIL: 'RETAIL',
  CAKE_ORDER: 'CAKE_ORDER',
  WHOLESALE: 'WHOLESALE'
};

exports.SubmissionStatus = exports.$Enums.SubmissionStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  DONE: 'DONE'
};

exports.Prisma.ModelName = {
  User: 'User',
  Session: 'Session',
  SiteSettings: 'SiteSettings',
  AnnouncementBar: 'AnnouncementBar',
  HomeSection: 'HomeSection',
  Category: 'Category',
  Product: 'Product',
  ProductImage: 'ProductImage',
  Promotion: 'Promotion',
  PromotionProduct: 'PromotionProduct',
  WholesaleSettings: 'WholesaleSettings',
  WholesaleStep: 'WholesaleStep',
  FaqItem: 'FaqItem',
  Location: 'Location',
  StoryBlock: 'StoryBlock',
  GalleryItem: 'GalleryItem',
  Testimonial: 'Testimonial',
  FormSubmission: 'FormSubmission',
  PageSeo: 'PageSeo',
  MediaFile: 'MediaFile',
  ActivityLog: 'ActivityLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
