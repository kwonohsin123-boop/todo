import {
  AlertCircleIcon,
  ArchiveIcon,
  BellIcon,
  BookmarkIcon,
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  CloudIcon,
  CodeIcon,
  CompassIcon,
  CopyIcon,
  DownloadIcon,
  FileTextIcon,
  FilterIcon,
  FolderIcon,
  GitBranchIcon,
  HeartIcon,
  HouseIcon,
  ImageIcon,
  InboxIcon,
  LayersIcon,
  Link2Icon,
  LockIcon,
  MailIcon,
  MapIcon,
  MenuIcon,
  MoonIcon,
  PackageIcon,
  PencilIcon,
  SearchIcon,
  SettingsIcon,
  Share2Icon,
  StarIcon,
  SunIcon,
  Trash2Icon,
  UploadIcon,
  UserIcon,
  ZapIcon,
} from "lucide-react"

import { Card } from "@/components/ui/card"

export const metadata = {
  title: "아이콘",
  description: "lucide-react 아이콘 사용 예시",
}

const icons = [
  { name: "AlertCircleIcon", Icon: AlertCircleIcon },
  { name: "ArchiveIcon", Icon: ArchiveIcon },
  { name: "BellIcon", Icon: BellIcon },
  { name: "BookmarkIcon", Icon: BookmarkIcon },
  { name: "CalendarIcon", Icon: CalendarIcon },
  { name: "CheckIcon", Icon: CheckIcon },
  { name: "ChevronRightIcon", Icon: ChevronRightIcon },
  { name: "CloudIcon", Icon: CloudIcon },
  { name: "CodeIcon", Icon: CodeIcon },
  { name: "CompassIcon", Icon: CompassIcon },
  { name: "CopyIcon", Icon: CopyIcon },
  { name: "DownloadIcon", Icon: DownloadIcon },
  { name: "FileTextIcon", Icon: FileTextIcon },
  { name: "FilterIcon", Icon: FilterIcon },
  { name: "FolderIcon", Icon: FolderIcon },
  { name: "GitBranchIcon", Icon: GitBranchIcon },
  { name: "HeartIcon", Icon: HeartIcon },
  { name: "HouseIcon", Icon: HouseIcon },
  { name: "ImageIcon", Icon: ImageIcon },
  { name: "InboxIcon", Icon: InboxIcon },
  { name: "LayersIcon", Icon: LayersIcon },
  { name: "Link2Icon", Icon: Link2Icon },
  { name: "LockIcon", Icon: LockIcon },
  { name: "MailIcon", Icon: MailIcon },
  { name: "MapIcon", Icon: MapIcon },
  { name: "MenuIcon", Icon: MenuIcon },
  { name: "MoonIcon", Icon: MoonIcon },
  { name: "PackageIcon", Icon: PackageIcon },
  { name: "PencilIcon", Icon: PencilIcon },
  { name: "SearchIcon", Icon: SearchIcon },
  { name: "SettingsIcon", Icon: SettingsIcon },
  { name: "Share2Icon", Icon: Share2Icon },
  { name: "StarIcon", Icon: StarIcon },
  { name: "SunIcon", Icon: SunIcon },
  { name: "Trash2Icon", Icon: Trash2Icon },
  { name: "UploadIcon", Icon: UploadIcon },
  { name: "UserIcon", Icon: UserIcon },
  { name: "ZapIcon", Icon: ZapIcon },
]

export default function IconsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-14">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Lucide 아이콘</h1>
        <p className="text-muted-foreground">
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            lucide-react
          </code>
          에서 이름으로 임포트해 사용합니다. 이름 기반 임포트라 사용한 아이콘만 번들에
          포함됩니다.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {icons.map(({ name, Icon }) => (
          <Card
            key={name}
            className="flex flex-col items-center justify-center gap-2 p-4"
          >
            <Icon className="size-6" />
            <span className="text-center text-[11px] break-all text-muted-foreground">
              {name}
            </span>
          </Card>
        ))}
      </div>
    </div>
  )
}
