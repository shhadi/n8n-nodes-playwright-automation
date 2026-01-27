import type { ExtractionResult } from './interfaces/ExtractionResult';
import type { FileResult } from './interfaces/FileResult';
import type { InteractionResult } from './interfaces/InteractionResult';
import type { MediaResult } from './interfaces/MediaResult';
import type { NavigationResult } from './interfaces/NavigationResult';
import type { SessionResult } from './interfaces/SessionResult';

export type ActionResult =
    | SessionResult
    | NavigationResult
    | InteractionResult
    | ExtractionResult
    | MediaResult
    | FileResult;
