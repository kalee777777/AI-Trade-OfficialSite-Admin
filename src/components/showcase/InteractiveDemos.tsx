'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

/** 演示页专用的一组交互组件实况（全部来自 src/components/ui/）。 */

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="a1">
        <AccordionTrigger>What is your MOQ?</AccordionTrigger>
        <AccordionContent>Our MOQ is 200 units. Trial orders are negotiable.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="a2">
        <AccordionTrigger>How long is the lead time?</AccordionTrigger>
        <AccordionContent>15–25 days after receiving the deposit.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function TabsDemo() {
  return (
    <Tabs defaultValue="specs" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="specs">Specifications</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="faq">FAQ</TabsTrigger>
      </TabsList>
      <TabsContent value="specs" className="text-sm text-muted-foreground">Spec table goes here…</TabsContent>
      <TabsContent value="features" className="text-sm text-muted-foreground">Feature list goes here…</TabsContent>
      <TabsContent value="faq" className="text-sm text-muted-foreground">FAQ list goes here…</TabsContent>
    </Tabs>
  );
}

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm quotation</DialogTitle>
          <DialogDescription>
            This is a centered modal with overlay, focus trap and ESC-to-close.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm">Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Side panel</SheetTitle>
          <SheetDescription>
            Slides in from the edge — the mobile navigation uses this component.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export function DropdownDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open Dropdown</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Row actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
        <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SelectDemo() {
  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor="ship-mode">Shipping Mode (ui/Select)</Label>
      <Select defaultValue="sea">
        <SelectTrigger id="ship-mode">
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sea">Sea freight (FCL)</SelectItem>
          <SelectItem value="air">Air freight</SelectItem>
          <SelectItem value="express">Express (DHL/FedEx)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function FormDemo() {
  return (
    <div className="grid w-full max-w-lg gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="demo-name" className="mb-1 block">Name</Label>
        <Input id="demo-name" placeholder="John Smith" />
      </div>
      <div>
        <Label htmlFor="demo-email" className="mb-1 block">Email</Label>
        <Input id="demo-email" type="email" placeholder="john@company.com" />
      </div>
    </div>
  );
}
