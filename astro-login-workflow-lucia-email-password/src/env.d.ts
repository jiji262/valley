/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    auth: AuthRequest<Lucia.Auth>
  }
}
