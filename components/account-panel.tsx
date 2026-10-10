"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uniquePassports } from "@/lib/data";
import {
  PROFILE_KEY,
  SESSION_KEY,
  emptyProfile,
  type Session,
} from "@/lib/storage";
import { useLocalJson } from "@/lib/use-local-json";
import { INTERESTS, type Interest, type Profile } from "@/lib/types";

const emptySession: Session | null = null;
const emptyStoredProfile: Profile | null = null;

export function AccountPanel() {
  const [session, setSession] = useLocalJson<Session | null>(
    SESSION_KEY,
    emptySession,
  );
  const [storedProfile, setStoredProfile] = useLocalJson<Profile | null>(
    PROFILE_KEY,
    emptyStoredProfile,
  );
  const [email, setEmail] = useState("");
  const [magicLink, setMagicLink] = useState("");
  const [draft, setDraft] = useState<Profile | null>(null);
  const [saved, setSaved] = useState(false);

  const activeSession = session;
  const profile =
    draft ?? storedProfile ?? emptyProfile(activeSession?.email ?? "");

  function completeSignIn(nextEmail: string) {
    setSession({ email: nextEmail, signedInAt: new Date().toISOString() });
  }

  async function requestLink(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await response.json()) as { url?: string };
    setMagicLink(data.url ?? "");
  }

  function signOut() {
    window.localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event("whh-storage"));
    setDraft(null);
    setMagicLink("");
  }

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setStoredProfile({ ...profile, email: activeSession?.email ?? profile.email });
    setSaved(true);
  }

  function toggleInterest(interest: Interest, checked: boolean) {
    setDraft({
      ...profile,
      interests: checked
        ? [...profile.interests, interest]
        : profile.interests.filter((item) => item !== interest),
    });
  }

  if (!activeSession) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mock magic-link sign-in</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={requestLink} className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <Button type="submit">Email me a link</Button>
          </form>
          {magicLink ? (
            <p className="text-sm">
              Mock inbox:{" "}
              <button
                type="button"
                className="underline underline-offset-4"
                onClick={() => completeSignIn(email)}
              >
                Open magic link
              </button>
            </p>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Signed in as {activeSession.email}</CardTitle>
        <Button type="button" variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={saveProfile} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="passport">Passport</Label>
            <Input
              id="passport"
              list="passports"
              value={profile.passport}
              onChange={(event) =>
                setDraft({ ...profile, passport: event.target.value })
              }
              required
            />
            <datalist id="passports">
              {uniquePassports().map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="age-range">Age range</Label>
            <Input
              id="age-range"
              placeholder="18–25"
              value={profile.ageRange}
              onChange={(event) =>
                setDraft({ ...profile, ageRange: event.target.value })
              }
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="from">Available from</Label>
              <Input
                id="from"
                type="date"
                value={profile.availableFrom}
                onChange={(event) =>
                  setDraft({ ...profile, availableFrom: event.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="to">Available to</Label>
              <Input
                id="to"
                type="date"
                value={profile.availableTo}
                onChange={(event) =>
                  setDraft({ ...profile, availableTo: event.target.value })
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="commitment">Minimum commitment (months)</Label>
            <Input
              id="commitment"
              type="number"
              min={1}
              max={24}
              value={profile.minCommitmentMonths}
              onChange={(event) =>
                setDraft({
                  ...profile,
                  minCommitmentMonths: event.target.value,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="languages">Languages</Label>
            <Input
              id="languages"
              value={profile.languages}
              onChange={(event) =>
                setDraft({ ...profile, languages: event.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="jlpt">Japanese level</Label>
            <Input
              id="jlpt"
              placeholder="None, N5, N4, N3, N2, N1"
              value={profile.japaneseLevel}
              onChange={(event) =>
                setDraft({ ...profile, japaneseLevel: event.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="experience">Past working holiday jobs</Label>
            <Textarea
              id="experience"
              value={profile.experience}
              onChange={(event) =>
                setDraft({ ...profile, experience: event.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="references">Reference contacts</Label>
            <Textarea
              id="references"
              value={profile.references}
              onChange={(event) =>
                setDraft({ ...profile, references: event.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="certs">Certificates</Label>
            <Textarea
              id="certs"
              value={profile.certificates}
              onChange={(event) =>
                setDraft({ ...profile, certificates: event.target.value })
              }
            />
          </div>
          <fieldset className="grid gap-2">
            <legend className="text-sm font-medium">Interests</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {INTERESTS.map((interest) => (
                <label key={interest} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={profile.interests.includes(interest)}
                    onCheckedChange={(checked) =>
                      toggleInterest(interest, checked === true)
                    }
                  />
                  {interest}
                </label>
              ))}
            </div>
          </fieldset>
          <Button type="submit">Save profile</Button>
          {saved ? (
            <p className="text-sm" role="status">
              Profile saved in this browser.
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
