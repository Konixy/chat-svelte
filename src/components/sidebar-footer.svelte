<script lang="ts">
import * as Sidebar from '@/components/ui/sidebar';
import * as DropdownMenu from '@/components/ui/dropdown-menu';
import UserAvatar from './user-avatar.svelte';
import type { User } from '@/lib/types';
import { ChevronsUpDown, LogOut, MessageCirclePlus, Moon, Sun } from 'lucide-svelte';
import { authClient } from '@/lib/auth/auth-client';
import { goto } from '$app/navigation';
import { mode, setMode, userPrefersMode } from 'mode-watcher';

let { user }: { user: User } = $props();
const sidebar = Sidebar.useSidebar();

async function signOut() {
	await authClient.signOut({
		fetchOptions: {
			onSuccess: () => {
				goto('/auth');
			}
		}
	});
}
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<UserAvatar {user} squared class="size-9 rounded-lg" />
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">{user.name}</span>
							<span class="text-muted-foreground truncate text-sm">{user.username}</span>
						</div>
						<ChevronsUpDown class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<UserAvatar {user} squared class="h-8 w-8 rounded-lg" />
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						{#if $mode === 'light'}
							<Sun />
						{:else}
							<Moon />
						{/if}
						App Theme
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.RadioGroup value={$userPrefersMode}>
							<DropdownMenu.RadioItem value="light" onclick={() => setMode('light')}
								>Light</DropdownMenu.RadioItem
							>
							<DropdownMenu.RadioItem value="dark" onclick={() => setMode('dark')}
								>Dark</DropdownMenu.RadioItem
							>
							<DropdownMenu.Separator />
							<DropdownMenu.RadioItem value="system" onclick={() => setMode('system')}
								>System</DropdownMenu.RadioItem
							>
						</DropdownMenu.RadioGroup>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={signOut} class="data-highlighted:bg-destructive">
					<LogOut />
					Log out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
