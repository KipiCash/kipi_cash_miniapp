"use client";

import type { Store } from "@/db/types";
import { PhoneIcon as WhatsappIcon, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StoreHeaderProps {
  store: Store;
  categories: { id: string; name: string }[];
}

export default function StoreHeader({ store, categories }: StoreHeaderProps) {
  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="w-full h-48 relative bg-gray-200 rounded-t-xl overflow-hidden">
        <img
          src={
            store.local?.referenceImgLink ||
            "/placeholder.svg?height=192&width=768"
          }
          alt={`${store.name} banner`}
          // fill
          className="object-cover w-full h-full"
          // priority
        />
      </div>

      {/* Store Info Card */}
      <Card className="mt-6 pt-8">
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Store Name and Categories */}
            <div>
              <div>
                {/* Store Logo */}
                <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                  <img
                    src={
                      store.logoImgLink || "/placeholder.svg?height=96&width=96"
                    }
                    alt={store.name}
                    // fill
                    className="object-cover w-full h-full"
                  />
                </div>
                <h1 className="text-2xl font-bold">{store.name}</h1>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {categories.map((category) => (
                  <span
                    key={category.id}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 text-sm">
              {/* Address */}
              {store.local?.direction && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600">
                      {store.local.direction.direction}
                    </p>
                    {store.local.reference && (
                      <p className="text-gray-500 text-xs mt-0.5">
                        {store.local.reference}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Phone Numbers */}
              {store.contact?.number && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">
                        {store.contact.number}
                      </span>
                      <Link
                        href={`https://wa.me/${store.contact.number.replace(
                          /\D/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <WhatsappIcon className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                    {store.contact.altNumbers.map((number, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-gray-600">{number}</span>
                        <Link
                          href={`https://wa.me/${number.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <WhatsappIcon className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Email */}
              {store.contact?.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-600">{store.contact.email}</span>
                </div>
              )}

              {/* Social Media Links */}
              {store.contact?.socialMedia &&
                store.contact.socialMedia.size > 0 && (
                  <div className="flex gap-2 pt-2">
                    {Array.from(store.contact.socialMedia.entries()).map(
                      ([platform, url]) => (
                        <Link
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3"
                          >
                            {platform}
                          </Button>
                        </Link>
                      )
                    )}
                  </div>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
