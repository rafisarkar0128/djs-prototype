import type { ClientEvents, RestEvents } from 'discord.js';
import type { BotClient } from '#core/client/BotClient.js';

/**
 * Shared metadata across all event listeners.
 */
interface BaseEventMeta {
  /** Brief summary of what this listener handles */
  description?: string;
  /** Whether the listener should fire only once */
  once?: boolean;
  /** Whether this listener is ignored by the loader */
  disabled?: boolean;
}

/**
 * Event listener bound to the Discord Gateway (`client`).
 */
export interface GatewayEvent<
  K extends keyof ClientEvents = keyof ClientEvents,
> extends BaseEventMeta {
  name: K;
  rest?: false;
  execute: (client: BotClient, ...args: ClientEvents[K]) => Promise<any> | any;
}

/**
 * Event listener bound to the Discord REST manager (`client.rest`).
 */
export interface RestEvent<K extends keyof RestEvents = keyof RestEvents> extends BaseEventMeta {
  name: K;
  rest: true;
  execute: (client: BotClient, ...args: RestEvents[K]) => Promise<any> | any;
}

/**
 * Discriminant union representing any valid Discord event listener.
 */
export type BotEvent<
  K extends keyof ClientEvents = keyof ClientEvents,
  R extends keyof RestEvents = keyof RestEvents,
> = GatewayEvent<K> | RestEvent<R>;
