import { PartialType } from '@nestjs/swagger';

import { CreateProductEventDto } from './create-product_event.dto';

export class UpdateProductEventDto extends PartialType(CreateProductEventDto) {}
